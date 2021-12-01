const { genericHandler } = require('../genericHandler');

/**
 * Clears the refresh token from the cookie
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.deleteAuthCookieLambda = event =>
  genericHandler(event, () => {
    return {
      body: JSON.stringify({ message: 'success' }),
      headers: {
        'Set-Cookie':
          'refreshToken=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT',
      },
      statusCode: 200,
    };
  });
