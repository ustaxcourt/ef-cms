const { genericHandler } = require('../genericHandler');

/**
 * used for prioritizing a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.prioritizeCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().prioritizeCaseInteractor({
      applicationContext,
      caseId: event.pathParameters.caseId,
      reason: JSON.parse(event.body).reason,
    });
  });
