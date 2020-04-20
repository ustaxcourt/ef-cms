const { genericHandler } = require('../genericHandler');

/**
 * get eligible cases for trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getEligibleCasesForTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .getEligibleCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId,
      });
  });
