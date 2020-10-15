const {
  marshallDocumentDownloadUrl,
} = require('./marshallers/marshallDocumentDownloadUrl');
const { genericHandler } = require('../genericHandler');
const { v1ApiWrapper } = require('./v1ApiWrapper');

/**
 * used for getting the download policy which is needed for consumers to download files directly from S3
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getDocumentDownloadUrlLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return v1ApiWrapper(async () => {
      const urlObject = await applicationContext
        .getUseCases()
        .getDownloadPolicyUrlInteractor({
          applicationContext,
          ...event.pathParameters,
        });

      return marshallDocumentDownloadUrl(urlObject);
    });
  });
