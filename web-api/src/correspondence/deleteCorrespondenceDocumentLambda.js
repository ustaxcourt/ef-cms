const { genericHandler } = require('../genericHandler');

/**
 * deletes a correspondence document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.deleteCorrespondenceDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { caseId, documentId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .deleteCorrespondenceDocumentInteractor({
        applicationContext,
        caseId,
        documentId,
      });
  });
