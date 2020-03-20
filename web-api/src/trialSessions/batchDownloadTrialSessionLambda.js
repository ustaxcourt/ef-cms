const { genericHandler } = require('../genericHandler');

/**
 * batch download trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.batchDownloadTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || event.path;

    return await applicationContext
      .getUseCases()
      .batchDownloadTrialSessionInteractor({
        applicationContext,
        trialSessionId,
      });
  });
