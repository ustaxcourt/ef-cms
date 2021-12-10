const { createCookieString } = require('../utilities/cookieFormatting');
const { genericHandler } = require('../genericHandler');

/**
 * Sets the authentication cookie based on the OAuth code
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.authenticateUserLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { refreshToken, token } = await applicationContext
        .getUseCases()
        .authenticateUserInteractor(applicationContext, JSON.parse(event.body));
      const expiresAt = applicationContext.getUtilities().calculateISODate({
        dateString: applicationContext.getUtilities().createISODateString(),
        howMuch: 29,
        units: 'days',
      });

      return {
        body: JSON.stringify({ token }),
        headers: {
          'Set-Cookie': createCookieString(
            'refreshToken',
            refreshToken,
            expiresAt,
            process.env.EFCMS_DOMAIN,
            !process.env.IS_LOCAL,
          ),
        },
        statusCode: 200,
      };
    },
    { bypassMaintenanceCheck: true },
  );
