const createApplicationContext = require('../applicationContext');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * used for getting the download policy which is needed for users to download files directly from S3 via the UI
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.get = event =>
  handle(() => {
    const applicationContext = createApplicationContext();
    return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      documentId: event.pathParameters.documentId,
      applicationContext,
    });
  });
