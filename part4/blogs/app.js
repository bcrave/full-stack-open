const express = require("express");
require("express-async-errors");
const { json } = require("express");
const { connect } = require("mongoose");
const cors = require("cors");

const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const { MONGO_DB_URI } = require("./utils/config");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const mongoUrl = MONGO_DB_URI;

logger.info("Connecting to MongoDB");

connect(mongoUrl)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB", error.message);
  });

const app = express();

app.use(cors());
app.use(json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
