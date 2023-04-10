const { genericHandler } = require('../genericHandler');

/**
 * checks availability of an email address in cognito
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.checkEmailAvailabilityLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { email } = event.queryStringParameters;

    return await applicationContext
      .getUseCases()
      .checkEmailAvailabilityInteractor(applicationContext, {
        email,
      });
  });
