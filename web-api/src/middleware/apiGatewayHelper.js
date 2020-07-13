const jwt = require('jsonwebtoken');
const {
  NotFoundError,
  UnauthorizedError,
  UnsanitizedEntityError,
} = require('../../../shared/src/errors/errors');
const { pick } = require('lodash');
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'max-age=0, private, no-cache, no-store, must-revalidate',
  'Content-Type': 'application/json',
  Pragma: 'no-cache',
  'X-Content-Type-Options': 'nosniff',
};
const createApplicationContext = require('../applicationContext');

exports.headers = headers;

/**
 * invokes the param fun and returns a lambda specific object containing error messages and status codes depending on any caught exceptions (or none)
 *
 * @param {Function} event the api gateway event
 * @param {Function} fun an function which either returns a promise containing payload data, or throws an exception
 * @returns {object} the api gateway response object containing the statusCode, body, and headers
 */
exports.handle = async (event, fun) => {
  const applicationContext = createApplicationContext({});
  try {
    let response = await fun();

    // Check to see if the server responded with a pdf buffer
    const isPdfBuffer =
      response != null &&
      typeof response[Symbol.iterator] === 'function' &&
      response.indexOf('%PDF-') > -1;

    if (isPdfBuffer) {
      return {
        body: response.toString('base64'),
        headers: {
          ...headers,
          'Content-Type': 'application/pdf',
          'accept-ranges': 'bytes',
        },
        isBase64Encoded: true,
        statusCode: 200,
      };
    } else {
      const privateKeys = applicationContext.getPersistencePrivateKeys();
      (Array.isArray(response) ? response : [response]).forEach(item => {
        if (item && Object.keys(item).some(key => privateKeys.includes(key))) {
          throw new UnsanitizedEntityError();
        }
      });
      if (event.queryStringParameters && event.queryStringParameters.fields) {
        const { fields } = event.queryStringParameters;
        const fieldsArr = fields.split(',');
        if (Array.isArray(response)) {
          response = response.map(object => pick(object, fieldsArr));
        } else {
          response = pick(response, fieldsArr);
        }
      }

      return exports.sendOk(response);
    }
  } catch (err) {
    if (!process.env.CI && !err.skipLogging) {
      console.error('err', err);
    }
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

/**
 * @param {Function} event the api gateway event
 * @param {Function} fun an async function which returns an object containing a url property to redirect the user to
 * @param {number} statusCode the statusCode to return in the api gateway response object (defaults to 302)
 * @returns {object} the api gateway response object with the Location set to the url returned from fun
 */
exports.redirect = async (event, fun, statusCode = 302) => {
  try {
    const { url } = await fun();
    return {
      headers: {
        Location: url,
      },
      statusCode,
    };
  } catch (err) {
    return exports.sendError(err);
  }
};

/**
 * creates and returns a 400 status lambda api gateway object containing the error message
 *
 * @param {Error} err the error to convert to the api gateway response event
 * @returns {object} an api gateway response object
 */
exports.sendError = err => {
  return {
    body: JSON.stringify(err.message),
    headers,
    statusCode: err.statusCode || '400',
  };
};

/**
 * returns a lambda api-gateway object with a 400 status code and the response payload passed in
 *
 * @param {object} response the object to send back from the api
 * @param {number} statusCode the statusCode of the request
 * @returns {object} an api gateway response object
 */
exports.sendOk = (response, statusCode = '200') => {
  return {
    body: JSON.stringify(response),
    headers,
    statusCode,
  };
};

/**
 * Extracts and validates the authorization header from the api-gateway event's header or query string.
 *
 * This assumes the authorization header is formatted with either:
 *  - Authorization: "Bearer SOME_TOKEN"
 *  - authorization: "Bearer SOME_TOKEN"
 *  - http://example.com?token=SOME_TOKEN
 *
 * @param {object} event the API gateway request event with would contain headers, params, or query string, etc.
 * @returns {string} the token found in either the header or ?token query string
 */
exports.getAuthHeader = event => {
  let usernameTokenArray;
  const authorizationHeader =
    event.headers &&
    (event.headers.Authorization || event.headers.authorization);
  if (event.queryStringParameters && event.queryStringParameters.token) {
    return event.queryStringParameters.token;
  }
  if (event.query && event.query.token) {
    return event.query.token;
  }
  if (authorizationHeader) {
    usernameTokenArray = authorizationHeader.split(' ');
    if (!usernameTokenArray || !usernameTokenArray[1]) {
      throw new UnauthorizedError(
        'Error: Authorization Bearer token is required',
      ); //temp until actual authorization is added
    }
    return usernameTokenArray[1];
  } else {
    return null;
  }
};

/**
 * extracts and decodes the JWT token from the gateway response event's header / query string and returns the decoded user object
 *
 * @param {object} event the api gateway request event
 * @returns {object} the user decoded from the JWT token
 */
exports.getUserFromAuthHeader = event => {
  const token = exports.getAuthHeader(event);
  if (!token) return null;
  const decoded = jwt.decode(token);
  if (decoded) {
    decoded.token = token;
    decoded.role = decoded['custom:role'];
    decoded.userId = decoded.sub;
    return decoded;
  } else {
    return null;
  }
};
