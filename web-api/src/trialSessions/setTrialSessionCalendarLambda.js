const { genericHandler } = require('../genericHandler');

/**
 * set trial session calendar
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.setTrialSessionCalendarLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .setTrialSessionCalendarInteractor({
        applicationContext,
        trialSessionId,
      });
  });
