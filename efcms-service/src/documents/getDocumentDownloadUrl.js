const { redirect, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for getting the download policy which is needed for users to download files directly from S3 via the UI
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  redirect(event, () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      documentId: event.pathParameters.documentId,
      applicationContext,
    });
  });
