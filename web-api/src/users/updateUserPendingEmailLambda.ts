const { genericHandler } = require('../genericHandler');

/**
 * updates the user pending email
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updateUserPendingEmailLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateUserPendingEmailInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
