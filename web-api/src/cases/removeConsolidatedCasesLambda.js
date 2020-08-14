const { genericHandler } = require('../genericHandler');

/**
 * used for removing cases from consolidation
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.removeConsolidatedCasesLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const docketNumbersToRemove = (
      event.queryStringParameters.docketNumbersToRemove || ''
    ).split(',');

    return await applicationContext
      .getUseCases()
      .removeConsolidatedCasesInteractor({
        applicationContext,
        ...event.pathParameters,
        docketNumbersToRemove,
      });
  });
