const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

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
    const applicationContext = createApplicationContext()
    return applicationContext.getPersistenceGateway().getUploadPolicy({
      applicationContext,
    });
  });
