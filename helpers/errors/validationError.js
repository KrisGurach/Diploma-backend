const { validationErrorCode } = require('../statusCodeHelpers');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = validationErrorCode;
  }
}

module.exports = ValidationError;
