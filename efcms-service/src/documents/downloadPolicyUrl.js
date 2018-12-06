const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

const {
  getDownloadPolicyUrl
} = require('ef-cms-shared/src/persistence/getDownloadPolicyUrl');

/**
 * GET Pre-signed Policy URL API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */
exports.get = event =>
  handle(() =>
    getDownloadPolicyUrl({
      documentId: event.pathParameters.documentId,
      applicationContext,
    }),
  );
