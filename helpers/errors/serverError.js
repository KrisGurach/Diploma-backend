const { serverErrorCode } = require('../statusCodeHelpers');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = serverErrorCode;
  }
}

module.exports = ServerError;
