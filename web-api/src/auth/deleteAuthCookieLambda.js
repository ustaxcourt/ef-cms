const { deleteCookieString } = require('../utilities/cookieFormatting');
const { genericHandler } = require('../genericHandler');

/**
 * Clears the refresh token from the cookie
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.deleteAuthCookieLambda = event =>
  genericHandler(
    event,
    () => {
      return {
        body: JSON.stringify({ message: 'success' }),
        headers: {
          'Set-Cookie': deleteCookieString(
            'refreshToken',
            process.env.EFCMS_DOMAIN,
          ),
        },
        statusCode: 200,
      };
    },
    {
      bypassMaintenanceCheck: true,
    },
  );
