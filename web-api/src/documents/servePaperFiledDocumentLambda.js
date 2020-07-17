const { genericHandler } = require('../genericHandler');

/**
 * used for serving paper filed documents
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.servePaperFiledDocumentLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const {
        pathParameters: { caseId, documentId },
      } = event;

      return await applicationContext
        .getUseCases()
        .servePaperFiledDocumentInteractor({
          applicationContext,
          caseId,
          documentId,
        });
    },
    {
      logEvent: true,
    },
  );
