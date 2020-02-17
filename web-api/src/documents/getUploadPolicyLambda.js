const { genericHandler } = require('../genericHandler');

/**
 * used for getting the upload policy which is needed for users to upload directly to S3 via the UI
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().getUploadPolicyInteractor({
      applicationContext,
      documentId: event.pathParameters.documentId,
    });
  });
