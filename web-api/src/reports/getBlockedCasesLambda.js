const { genericHandler } = require('../genericHandler');

/**
 * used for getting all the blocked cases for a trial location
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getBlockedCasesLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().getBlockedCasesInteractor({
      applicationContext,
      trialLocation: event.pathParameters.trialLocation,
    });
  });
