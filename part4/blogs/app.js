import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';

import logger from './utils/logger';
import middleware from './utils/middleware';
import { MONGO_DB_URI } from './utils/config';

import blogsRouter from './controllers/blogs';

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

export default app;
