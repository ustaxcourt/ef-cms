const { genericHandler } = require('../genericHandler');

/**
 * sets a trial session as a swing session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.setTrialSessionAsSwingSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .setTrialSessionAsSwingSessionInteractor({
        applicationContext,
        swingSessionId: JSON.parse(event.body).swingSessionId,
        trialSessionId: trialSessionId,
      });
  });
