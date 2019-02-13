const { handle, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for getting the upload policy which is needed for users to upload directly to S3 via the UI
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.create = event =>
  handle(() => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getPersistenceGateway().getUploadPolicy({
      applicationContext,
    });
  });
