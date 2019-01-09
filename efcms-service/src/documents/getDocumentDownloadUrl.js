const { redirect } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for getting the download policy which is needed for users to download files directly from S3 via the UI
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.get = event =>
  redirect(() => {
    const applicationContext = createApplicationContext();
    return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      documentId: event.pathParameters.documentId,
      applicationContext,
    });
  });
