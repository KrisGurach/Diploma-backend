require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { serverErrorCode } = require('./helpers/statusCodeHelpers');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { PORT = 3000 } = process.env;

const { CONNECTION_STRING = 'mongodb://0.0.0.0:27017/bitfilmsdb' } = process.env;

try {
  mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
  });
} catch (err) {
  console.log(`error connection: ${err}`);
}

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use((err, _, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === serverErrorCode
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`NODE_ENV = ${process.env.NODE_ENV}`);
});
