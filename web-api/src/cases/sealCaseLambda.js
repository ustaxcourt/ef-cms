const { genericHandler } = require('../genericHandler');

/**
 * used for marking a case as sealed
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.sealCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().sealCaseInteractor({
      applicationContext,
      ...event.pathParameters,
    });
  });
