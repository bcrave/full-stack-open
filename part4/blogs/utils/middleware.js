const jwt = require('jsonwebtoken');
const logger = require('./logger.js');

const User = require('../models/user');

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'Malformatted id' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === 'RecordNotFoundError') {
    return res.status(404).json({ error: 'Record not found' });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  }

  next(err);
};

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  }

  next();
};

const userExtractor = async (req, res, next) => {
  const { token } = req;

  if (!token) {
    req.user = null;
  } else {
    const { id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(id);
    req.user = user;
  }

  next();
};

const middleware = {
  unknownEndpoint,
  errorHandler,
  requestLogger,
  tokenExtractor,
  userExtractor,
};

module.exports = middleware;
