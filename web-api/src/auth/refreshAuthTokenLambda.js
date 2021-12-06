const { genericHandler } = require('../genericHandler');
const { parseCookieString } = require('../utilities/cookieFormatting');

/**
 * Sets the authentication cookie based on the OAuth code
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.refreshAuthTokenLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { refreshToken } = parseCookieString(event.headers.cookie);
    const { token } = await applicationContext
      .getUseCases()
      .refreshAuthTokenInteractor(applicationContext, {
        refreshToken,
      });
    return {
      token,
    };
  });
