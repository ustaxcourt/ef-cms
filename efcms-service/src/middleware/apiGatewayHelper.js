const {
  UnauthorizedError,
  NotFoundError,
} = require('ef-cms-shared/src/errors/errors');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

/**
 * invokes the param fun and returns a lambda specific object containing error messages and status codes depending on any caught exceptions (or none)
 *
 * @param {Function} fun
 * @returns {Object}
 */
exports.handle = async fun => {
  try {
    const response = await fun();
    return exports.sendOk(response);
  } catch (err) {
    console.error('err', err);
    if (err instanceof NotFoundError) {
      err.statusCode = 404;
      return exports.sendError(err);
    } else if (err instanceof UnauthorizedError) {
      err.statusCode = 403;
      return exports.sendError(err);
    } else {
      return exports.sendError(err);
    }
  }
};

exports.redirect = async (fun, statusCode = 302) => {
  try {
    const { url } = await fun();
    return {
      statusCode,
      headers: {
        Location: url,
      },
    };
  } catch (err) {
    return exports.sendError(err);
  }
};

/**
 * creates and returns a 400 status lambda api gateway object containing the error message
 *
 * @param {Error} err
 * @returns {Object}
 */
exports.sendError = err => {
  return {
    statusCode: err.statusCode || '400',
    body: JSON.stringify(err.message),
    headers,
  };
};

/**
 * returns a lambda api-gateway object with a 400 status code and the response payload passed in
 *
 * @param {Error} err
 * @returns {Object}
 */
exports.sendOk = (response, statusCode = '200') => {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers,
  };
};

/**
 * Extracts and validates the auth header from the api-gateway event.
 *
 * This assumes the auth header is formatted with either:
 *  - Authorization: "Bearer SOME_TOKEN"
 *  - authorization: "Bearer SOME_TOKEN"
 *
 * @param {Error} err
 * @returns {String} the token in the header
 */
exports.getAuthHeader = event => {
  let usernameTokenArray;
  const authorizationHeader =
    event.headers &&
    (event.headers.Authorization || event.headers.authorization);
  if (authorizationHeader) {
    usernameTokenArray = authorizationHeader.split(' ');
    if (!usernameTokenArray || !usernameTokenArray[1]) {
      throw new UnauthorizedError(
        'Error: Authorization Bearer token is required',
      ); //temp until actual auth is added
    }
  } else {
    throw new UnauthorizedError('Error: Authorization is required'); //temp until actual auth is added
  }

  return usernameTokenArray[1];
};
