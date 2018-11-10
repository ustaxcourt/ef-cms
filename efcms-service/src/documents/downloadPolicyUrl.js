const { getDocumentDownloadUrl } = require('./services/documentBlobDAO');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * GET Pre-signed Policy URL API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */
exports.get = event =>
  handle(() =>
    getDocumentDownloadUrl({
      documentId: event.pathParameters.documentId,
    })
  );
