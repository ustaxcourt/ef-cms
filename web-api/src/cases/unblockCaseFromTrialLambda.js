const { genericHandler } = require('../genericHandler');

/**
 * used for unblocking a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.unblockCaseFromTrialLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .unblockCaseFromTrialInteractor({
        applicationContext,
        ...event.pathParameters,
      });
  });
