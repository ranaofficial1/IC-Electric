// A thrown ApiError carries an HTTP status code; the central error handler
// (middleware/errorHandler.js) uses it to shape the JSON response.
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = ApiError;
