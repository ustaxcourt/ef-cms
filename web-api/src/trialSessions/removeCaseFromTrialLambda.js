const { genericHandler } = require('../genericHandler');

/**
 * used for setting a case on a trial session to removedFromTrial
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.removeCaseFromTrialLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const lambdaArgs = {
      ...event.pathParameters,
      ...JSON.parse(event.body),
    };
    return await applicationContext
      .getUseCases()
      .removeCaseFromTrialInteractor({
        applicationContext,
        ...lambdaArgs,
      });
  });
