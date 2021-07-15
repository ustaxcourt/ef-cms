const {
  marshallDocumentDownloadUrl,
} = require('./marshallers/marshallDocumentDownloadUrl');
const { genericHandler } = require('../genericHandler');
const { v2ApiWrapper } = require('./v2ApiWrapper');

/**
 * used for getting the download policy which is needed for consumers to download files directly from S3
 *
 * @param {object} event the AWS event object
 * @param {object} options options to optionally pass to the genericHandler
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getDocumentDownloadUrlLambda = (event, options = {}) =>
  genericHandler(
    event,
    ({ applicationContext }) => {
      return v2ApiWrapper(async () => {
        const urlObject = await applicationContext
          .getUseCases()
          .getDownloadPolicyUrlInteractor(applicationContext, {
            ...event.pathParameters,
          });

        return marshallDocumentDownloadUrl(urlObject);
      });
    },
    options,
  );
