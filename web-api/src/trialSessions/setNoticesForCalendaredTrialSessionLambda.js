const { genericHandler } = require('../genericHandler');

/**
 * used for generating / setting notices of trial on cases set for the given trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.setNoticesForCalendaredTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || event.path || {};

    return await applicationContext
      .getUseCases()
      .setNoticesForCalendaredTrialSessionInteractor({
        applicationContext,
        trialSessionId,
        ...event.body,
      });
  });
