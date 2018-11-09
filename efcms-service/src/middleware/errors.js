/**
 * Custom not found error handling for middlewares
 *
 * @type {module.NotFoundError}
 */
module.exports.NotFoundError = class NotFoundError extends Error {
  /**
   * constructor
   *
   * @param message
   */
  constructor(message) {
    super(message);

    this.statusCode = 404;
  }
};