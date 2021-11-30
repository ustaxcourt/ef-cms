const { genericHandler } = require('../genericHandler');

/**
 * Sets the authentication cookie based on the OAuth code
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.authenticationLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { idToken, refreshToken } = await applicationContext
      .getUseCases()
      .authenticateUserInteractor(applicationContext, JSON.parse(event.body));
    return {
      body: JSON.stringify({ message: 'success' }),
      headers: {
        'Set-Cookie': `idToken=MOOF`,
      },
      statusCode: 200,
    };
    //'Set-Cookie': [`idToken=${idToken}`, `refreshToken=${refreshToken}`],
  });
