const { genericHandler } = require('../genericHandler');

/**
 * deletes a trial session and all associated working session copies and puts any attached cases back to general docket.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.deleteTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await applicationContext.getUseCases().deleteTrialSessionInteractor({
      applicationContext,
      trialSessionId,
    });
  });
