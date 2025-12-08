import { ErrorWithStatusCode } from '../../errors/errors';

type StatusError = ErrorWithStatusCode & Error;
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
  statusCode: number;

  constructor(error: ErrorWithStatusCode) {
    const msg = error.message || 'An unexpected error occurred';
    super(msg);
    this.statusCode =
      error.statusCode && V2_API_ERROR_STATUS_CODES.includes(error.statusCode)
        ? error.statusCode
        : 500;
    this.stack = error.stack;
  }

  toResponseBody() {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export const v2ApiWrapper = async handler => {
  try {
    return await handler();
  } catch (e) {
    const error = (
      e instanceof Error ? e : new Error(String(e))
    ) as StatusError;
    // Workaround until https://github.com/ustaxcourt/ef-cms/pull/462 is resolved
    // (API returning 400 instead of 404 on unknown cases)
    if (error.message.includes('The Case entity was invalid')) {
      error.statusCode = 404;
      error.message = 'Case not found';
    }

    throw new v2ApiError(error);
  }
};
