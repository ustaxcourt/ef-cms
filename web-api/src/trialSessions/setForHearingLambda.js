const { genericHandler } = require('../genericHandler');

/**
 * creates a new trial session.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.createTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { docketNumber, trialSessionId } =
      event.pathParameters || event.path || {};

    return await applicationContext.getUseCases().setForHearingInteractor({
      applicationContext,
      docketNumber,
      note: JSON.parse(event.body),
      trialSessionId,
    });
  });
