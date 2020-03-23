const { genericHandler } = require('../genericHandler');

/**
 * used for fetching all cases (including consolidated) of a particular status, user role, etc
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getConsolidatedCasesByUserLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { userId } = event.pathParameters || {};

      return await applicationContext
        .getUseCases()
        .getConsolidatedCasesByUserInteractor({
          applicationContext,
          userId,
        });
    },
    { logResults: false, skipFiltering: true },
  );
