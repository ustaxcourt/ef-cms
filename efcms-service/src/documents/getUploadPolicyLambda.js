const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * Create Document API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */
/**
 * Create Upload Policy API Lambda
 */
exports.create = () =>
  handle(() => {
    return applicationContext.getPersistenceGateway().getUploadPolicy({
      applicationContext,
    });
  });
