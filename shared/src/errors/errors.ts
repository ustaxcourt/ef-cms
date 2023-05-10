/**
 * Custom not found error handling for middlewares
 * @type {module.NotFoundError}
 */
export class NotFoundError extends Error {
  public statusCode: number;
  /**
   * constructor
   * @param {string} message the error message
   */
  constructor(message) {
    super(message);

    this.statusCode = 404;
  }
}

/**
 * Invalid request error
 * @type {module.NotFoundError}
 */
export class InvalidRequest extends Error {
  public statusCode: number;
  /**
   * constructor
   * @param {string} message the error message
   */
  constructor(message) {
    super(message);

    this.statusCode = 400;
  }
}

/**
 * Custom unknown user error handling for middlewares
 * @type {module.UnknownUserError}
 */
export class UnknownUserError extends Error {
  public statusCode: number;
  /**
   * constructor
   * @param {string} message the error message
   */
  constructor(message) {
    super(message);

    this.statusCode = 401;
  }
}

/**
 * Unauthorized error
 * @type {module.UnauthorizedError}
 */
export class UnauthorizedError extends Error {
  public statusCode: number;
  /**
   * constructor
   * @param {string} message the error message
   */
  constructor(message) {
    super(message);

    this.statusCode = 403;
  }
}

/**
 * UnprocessableEntityError error
 * @type {module.UnprocessableEntity}
 */
export class UnprocessableEntityError extends Error {
  public statusCode: number;
  /**
   * constructor
   * @param {string} message the error message
   */
  constructor(message = 'cannot process') {
    super(message);

    this.statusCode = 422;
  }
}

/**
 * UnsanitizedEntityError error
 * @type {module.UnsanitizedEntity}
 */
export class UnsanitizedEntityError extends Error {
  public statusCode: number;
  /**
   * constructor
   * @param {string} message the error message
   */
  constructor(message = 'Unsanitized entity') {
    super(message);

    this.statusCode = 500;
  }
}

export class ServiceUnavailableError extends Error {
  public statusCode: number;
  public retryAfter?: number;
  /**
   * constructor
   * @param {string} message the error message
   */
  constructor(message = 'Service Unavailable', retryAfter = 3000) {
    super(message);

    this.retryAfter = retryAfter;
    this.statusCode = 503;
  }
}

/**
 * InvalidEntityError error
 * @type {module.InvalidEntityError}
 */
export class InvalidEntityError extends Error {
  /**
   * constructor
   * @param {string} message the error message
   */
  constructor(
    entityName,
    message = 'entity is invalid or invalid for operation',
    validationObject = {},
  ) {
    super(`The ${entityName} entity was invalid. ${message}`);
    Object.defineProperties(this, {
      details: {
        value: validationObject,
      },
    });
  }
}
