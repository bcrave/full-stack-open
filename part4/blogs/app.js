const express = require('express');
const { json } = require('express');
const { connect } = require('mongoose');
const cors = require('cors');

const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const { MONGO_DB_URI } = require('./utils/config');

const blogsRouter = require('./controllers/blogs');

const mongoUrl = MONGO_DB_URI;

logger.info('Connecting to MongoDB');

connect(mongoUrl)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB', error.message);
  });

const app = express();

app.use(cors());
app.use(json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
