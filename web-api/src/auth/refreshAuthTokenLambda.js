const { genericHandler } = require('../genericHandler');

/**
 * Sets the authentication cookie based on the OAuth code
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.refreshAuthTokenLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const cookiesInHeader = event.headers.cookie.split(';');
    const cookies = {};
    cookiesInHeader.forEach(cookieString => {
      const [key, value] = cookieString.split('=');
      cookies[key.trim()] = value;
    });
    const { idToken } = await applicationContext
      .getUseCases()
      .refreshAuthTokenInteractor(applicationContext, {
        refreshToken: cookies.refreshToken,
      });
    return {
      idToken,
    };
  });
