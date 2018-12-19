const createApplicationContext = require('../applicationContext');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * GET Pre-signed Policy URL API Lambda
 *
 * @param event
 */
exports.get = event =>
  handle(() => {
    const applicationContext = createApplicationContext();
    return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      documentId: event.pathParameters.documentId,
      applicationContext,
    });
  });
