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

/**
 * Unauthorized error
 *
 * @type {module.UnauthorizedError}
 */
module.exports.UnauthorizedError = class UnauthorizedError extends Error {
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

/**
 * UnprocessableEntityError error
 *
 * @type {module.UnprocessableEntity}
 */
module.exports.UnprocessableEntityError = class UnprocessableEntityError extends Error {
  /**
   * constructor
   *
   * @param message
   */
  constructor(message = "problem in body or url") {
    super(message);

    this.statusCode = 422;
  }
};