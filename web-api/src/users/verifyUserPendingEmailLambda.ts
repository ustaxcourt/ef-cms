const { genericHandler } = require('../genericHandler');

/**
 * verifies the user pending email
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.verifyUserPendingEmailLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .verifyUserPendingEmailInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
