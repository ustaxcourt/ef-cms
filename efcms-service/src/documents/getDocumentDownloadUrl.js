const createApplicationContext = require('../applicationContext');
const {
  getUserFromAuthHeader,
  redirect,
} = require('../middleware/apiGatewayHelper');

/**
 * used for getting the download policy which is needed for users to download files directly from S3 via the UI
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  redirect(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const results = await applicationContext
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
