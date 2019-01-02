const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for getting the upload policy which is needed for users to upload directly to S3 via the UI
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.create = () =>
  handle(() => {
    const applicationContext = createApplicationContext();
    return applicationContext.getPersistenceGateway().getUploadPolicy({
      applicationContext,
    });
  });
