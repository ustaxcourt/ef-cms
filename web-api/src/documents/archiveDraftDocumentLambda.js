const { genericHandler } = require('../genericHandler');

/**
 * archives the draft document information from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.archiveDraftDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { caseId, documentId } = event.pathParameters;

    return await applicationContext
      .getUseCases()
      .archiveDraftDocumentInteractor({
        applicationContext,
        caseId,
        documentId,
      });
  });
