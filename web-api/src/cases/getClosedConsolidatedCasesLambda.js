const { genericHandler } = require('../genericHandler');

/**
 * used for fetching all open cases
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getClosedConsolidatedCasesLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getClosedConsolidatedCasesInteractor({
        applicationContext,
      });
  });
