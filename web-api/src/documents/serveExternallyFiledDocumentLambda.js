const { genericHandler } = require('../genericHandler');

/**
 * used for serving externally filed documents
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.serveExternallyFiledDocumentLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const {
        pathParameters: { caseId, documentId },
      } = event;

      return await applicationContext
        .getUseCases()
        .serveExternallyFiledDocumentInteractor({
          applicationContext,
          caseId,
          documentId,
        });
    },
    {
      logEvent: true,
    },
  );
