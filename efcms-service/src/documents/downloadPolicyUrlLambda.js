const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * GET Pre-signed Policy URL API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */
exports.get = event =>
  handle(() =>
    applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      documentId: event.pathParameters.documentId,
      applicationContext,
    }),
  );
