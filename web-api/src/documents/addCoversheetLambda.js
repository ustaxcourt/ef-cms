const { genericHandler } = require('../genericHandler');

/**
 * used for adding a coversheet to a new document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.addCoversheetLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { caseId, documentId } = event.pathParameters || {};

      return await applicationContext.getUseCases().addCoversheetInteractor({
        applicationContext,
        caseId,
        documentId,
      });
    },
    { logEvent: true, logResults: false },
  );
