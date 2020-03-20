const { genericHandler } = require('../genericHandler');

/**
 * used for updating a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.saveCaseDetailInternalEditLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor({
        applicationContext,
        caseId: event.pathParameters.caseId,
        ...JSON.parse(event.body),
        caseToUpdate: JSON.parse(event.body),
      });
  });
