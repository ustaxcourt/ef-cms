const { genericHandler } = require('../genericHandler');

/**
 * used for removing cases from consolidation
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.removeConsolidatedCasesLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const caseIdsToRemove = (
      event.queryStringParameters.caseIdsToRemove || ''
    ).split(',');

    return await applicationContext
      .getUseCases()
      .removeConsolidatedCasesInteractor({
        applicationContext,
        caseId: event.pathParameters.caseId,
        caseIdsToRemove,
      });
  });
