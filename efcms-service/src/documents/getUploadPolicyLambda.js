const { handle, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for getting the upload policy which is needed for users to upload directly to S3 via the UI
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.create = event =>
  handle(() => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getPersistenceGateway().getUploadPolicy({
      applicationContext,
    });
  });
