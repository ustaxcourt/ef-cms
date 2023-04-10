const { genericHandler } = require('../genericHandler');

/**
 * get cases calendared on a trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getCalendaredCasesForTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .getCalendaredCasesForTrialSessionInteractor(applicationContext, {
        trialSessionId,
      });
  });
