const { genericHandler } = require('../genericHandler');

/**
 * Returns an upload url that allow the client to upload a practitioner document to an s3 bucket.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getPractitionerDocumentDownloadUrlLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getPractitionerDocumentDownloadUrlInteractor(applicationContext, {
        documentId: event.pathParameters.documentId,
      });
  });
