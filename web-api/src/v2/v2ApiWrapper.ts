/**
 * Errors returned by the v2 API. The structure of this object
 * and returned response codes are considered part of the API version
 * and should not change without incrementing the API version.
 *
 * The returned messages themselves are not part of the API version.
 *
 * 401: returned by API Gateway
 * 403: returned by wrapping UnauthorizedError
 * 404: returned by wrapping NotFoundError
 * 500: returned by wrapping any Error which doesn't specify a statusCode.
 */
const V2_API_ERROR_STATUS_CODES = [401, 403, 404, 500];

class v2ApiError extends Error {
  constructor(error) {
    super();
    this.statusCode = V2_API_ERROR_STATUS_CODES.includes(error.statusCode)
      ? error.statusCode
      : 500;
    this.message = {
      message: error.message || 'An unexpected error occurred',
      toString() {
        return this.message;
      },
    };
    this.stack = error.stack;
  }
}

export const v2ApiWrapper = async handler => {
  try {
    return await handler();
  } catch (e) {
    // Workaround until https://github.com/ustaxcourt/ef-cms/pull/462 is resolved
    // (API returning 400 instead of 404 on unknown cases)
    if (e.message.includes('The Case entity was invalid')) {
      e.statusCode = 404;
      e.message = 'Case not found';
    }

    throw new v2ApiError(e);
  }
};
