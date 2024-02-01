import {
  NotFoundError,
  UnauthorizedError,
  UnsanitizedEntityError,
} from '@web-api/errors/errors';
import { createApplicationContext } from '../applicationContext';
import { headerOverride } from '../lambdaWrapper';
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';

/**
 * invokes the param fun and returns a lambda specific object containing error messages and status codes depending on any caught exceptions (or none)
 *
 * @param {Function} event the api gateway event
 * @param {Function} fun an function which either returns a promise containing payload data, or throws an exception
 * @returns {object} the api gateway response object containing the statusCode, body, and headers
 */
export const handle = async (event, fun) => {
  const applicationContext = createApplicationContext({});
  try {
    let response = await fun();

    // Check to see if the server responded with a pdf buffer
    const isPdfBuffer =
      response != null &&
      typeof response[Symbol.iterator] === 'function' &&
      response.indexOf('%PDF-') > -1;

    if (
      response &&
      response.body !== undefined &&
      response.statusCode &&
      response.headers
    ) {
      // the lambda function is more advanced and wants to control more aspects of the response
      return sendOk(response.body, response.statusCode, response.headers);
    } else if (isPdfBuffer) {
      return {
        body: response.toString('base64'),
        headers: {
          ...headerOverride,
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

      return sendOk(response);
    }
  } catch (err) {
    if (!process.env.CI && !err.skipLogging) {
      console.error('err', err);
    }
    if (err instanceof NotFoundError) {
      err.statusCode = 404;
      return sendError(err);
    } else if (err instanceof UnauthorizedError) {
      err.statusCode = 403;
      return sendError(err);
    } else {
      return sendError(err);
    }
  }
};

/**
 * @param {Function} event the api gateway event
 * @param {Function} fun an async function which returns an object containing a url property to redirect the user to
 * @param {number} statusCode the statusCode to return in the api gateway response object (defaults to 302)
 * @returns {object} the api gateway response object with the Location set to the url returned from fun
 */
export const redirect = async (event, fun, statusCode = 302) => {
  try {
    const { url } = await fun();
    return {
      headers: {
        Location: url,
      },
      statusCode,
    };
  } catch (err) {
    return sendError(err);
  }
};

/**
 * creates and returns a 400 status lambda api gateway object containing the error message
 *
 * @param {Error} err the error to convert to the api gateway response event
 * @returns {object} an api gateway response object
 */
export const sendError = err => {
  return {
    body: JSON.stringify(err.message),
    headers: headerOverride,
    statusCode: err.statusCode || '400',
  };
};

/**
 * returns a lambda api-gateway object with a 200 status code and the response payload passed in
 *
 * @param {object} response the object to send back from the api
 * @param {number} statusCode the statusCode of the request.  Defaults to '200'.
 * @param {object} headers any headers that you want to add to the response.  Defaults to no additional headers.
 * @returns {object} an api gateway response object
 */
export const sendOk = (response, statusCode = '200', headers = {}) => {
  return {
    body: JSON.stringify(response),
    headers: {
      ...headers,
      ...headerOverride,
    },
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
export const getAuthHeader = event => {
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
export const getUserFromAuthHeader = event => {
  const token = getAuthHeader(event);
  if (!token) return null;
  const decoded = jwt.decode(token);
  if (decoded) {
    decoded.token = token;
    decoded.role = decoded['custom:role'];
    decoded.userId = decoded['custom:userId'] || decoded.sub;
    return decoded as { userId: string };
  } else {
    return null;
  }
};

/**
 * extracts the connectionId from the event header or query parameters and returns
 *
 * @param {object} event the api gateway request event
 * @returns {string|void} the connectionId
 */
export const getConnectionIdFromEvent = event => {
  if (
    event.queryStringParameters &&
    event.queryStringParameters.clientConnectionId
  ) {
    return event.queryStringParameters.clientConnectionId;
  }
};
