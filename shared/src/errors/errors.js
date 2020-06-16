/**
 * Custom not found error handling for middlewares
 *
 * @type {module.NotFoundError}
 */
module.exports.NotFoundError = class NotFoundError extends Error {
  /**
   * constructor
   *
   * @param {string} message the error message
   */
  constructor(message) {
    super(message);

    this.statusCode = 404;
  }
};

/**
 * Custom unknown user error handling for middlewares
 *
 * @type {module.UnknownUserError}
 */
module.exports.UnknownUserError = class UnknownUserError extends Error {
  /**
   * constructor
   *
   * @param {string} message the error message
   */
  constructor(message) {
    super(message);

    this.statusCode = 401;
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
   * @param {string} message the error message
   */
  constructor(message) {
    super(message);

    this.statusCode = 403;
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
   * @param {string} message the error message
   */
  constructor(message = 'cannot process') {
    super(message);

    this.statusCode = 422;
  }
};

/**
 * UnsanitizedEntityError error
 *
 * @type {module.UnsanitizedEntity}
 */
module.exports.UnsanitizedEntityError = class UnsanitizedEntityError extends Error {
  /**
   * constructor
   *
   * @param {string} message the error message
   */
  constructor(message = 'Unsanitized entity') {
    super(message);

    this.statusCode = 500;
  }
};

/**
 * InvalidEntityError error
 *
 * @type {module.InvalidEntityError}
 */
module.exports.InvalidEntityError = class InvalidEntityError extends Error {
  /**
   * constructor
   *
   * @param {string} message the error message
   */
  constructor(
    validationName,
    entityIds,
    message = 'entity is invalid or invalid for operation',
  ) {
    super(`The ${validationName} entity was invalid. ${message}. ${entityIds}`);
  }
};
