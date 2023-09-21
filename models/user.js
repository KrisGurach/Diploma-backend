const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const NotAuthorizedError = require('../helpers/errors/authorizationError');
const { notAuthorizedErrorMessage } = require('../helpers/constantsHelpers');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => validator.isEmail(email),
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotAuthorizedError(notAuthorizedErrorMessage);
      }

      return bcrypt.compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            throw new NotAuthorizedError(notAuthorizedErrorMessage);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
