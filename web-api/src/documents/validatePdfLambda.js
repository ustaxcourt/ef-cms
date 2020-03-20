const { genericHandler } = require('../genericHandler');

/**
 * used for sanitizing PDF documents
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.validatePdfLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { documentId } = event.pathParameters || {};

      return await applicationContext.getUseCases().validatePdfInteractor({
        applicationContext,
        documentId,
      });
    },
    {
      logEvent: true,
      logResultsLabel: 'Validate PDF Result',
    },
  );
