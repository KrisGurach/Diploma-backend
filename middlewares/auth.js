const jwt = require('jsonwebtoken');
const { notAuthorizedErrorMessage, secretKey } = require('../helpers/constantsHelpers');
const NotAuthorizedError = require('../helpers/errors/authorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorizedError(notAuthorizedErrorMessage);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  const key = NODE_ENV === 'production' ? JWT_SECRET : secretKey;

  try {
    payload = jwt.verify(token, key);
  } catch (err) {
    throw new NotAuthorizedError(notAuthorizedErrorMessage);
  }

  req.user = payload;

  next();
};
