const { forbiddenErrorCode } = require('../statusCodeHelpers');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = forbiddenErrorCode;
  }
}

module.exports = ForbiddenError;
