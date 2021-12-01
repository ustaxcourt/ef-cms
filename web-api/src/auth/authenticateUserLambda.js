const { genericHandler } = require('../genericHandler');

/**
 * Sets the authentication cookie based on the OAuth code
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.authenticateUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { refreshToken, token } = await applicationContext
      .getUseCases()
      .authenticateUserInteractor(applicationContext, JSON.parse(event.body));
    return {
      body: JSON.stringify({ token }),
      headers: {
        'Set-Cookie': `refreshToken=${refreshToken}; Secure; HttpOnly; Domain=${process.env.EFCMS_DOMAIN}`,
      },
      statusCode: 200,
    };
  });
