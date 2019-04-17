const createApplicationContext = require('../applicationContext');
const {
  redirect,
  getUserFromAuthHeader,
} = require('../middleware/apiGatewayHelper');

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
    try {
      const results = applicationContext
        .getPersistenceGateway()
        .getDownloadPolicyUrl({
          applicationContext,
          documentId: event.pathParameters.documentId,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
