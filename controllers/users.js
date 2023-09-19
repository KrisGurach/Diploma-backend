const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { secretKey } = require('../helpers/constantsHelpers');
const ValidationError = require('../helpers/errors/validationError');
const NotFoundError = require('../helpers/errors/notFoundError');
const ServerError = require('../helpers/errors/serverError');
const DuplicateUniqueValueError = require('../helpers/errors/duplicateUniqueValueError');
const { createSuccessStatusCode } = require('../helpers/statusCodeHelpers');

const { NODE_ENV, JWT_SECRET } = process.env;

const userNotFound = (id) => `Пользователь с указанным id = ${id} не найден.`;

function findUserById(id, res, next) {
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new ValidationError('Переданы некорректные данные при поиске пользователя.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(userNotFound(id)));
      } else {
        next(new ServerError());
      }
    });
}

const getCurrentUserById = (req, res, next) => {
  const id = req.user._id;
  findUserById(id, res, next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(new ServerError());
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      // eslint-disable-next-line no-shadow, no-underscore-dangle
      const { password, ...data } = user._doc;
      res.status(createSuccessStatusCode).send(data);
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
      } else if (e.code === 11000) {
        next(new DuplicateUniqueValueError('Пользователь с указанным email уже существует'));
      } else {
        next(new ServerError());
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : secretKey,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getCurrentUserById,
  updateUser,
  createUser,
  login,
};
