const { getDocumentDownloadUrl } = require('./services/documentBlobDAO');
const { redirect } = require('../middleware/apiGatewayHelper');

/**
 * GET Pre-signed Policy URL API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */
exports.get = event =>
  redirect(() =>
    getDocumentDownloadUrl({
      documentId: event.pathParameters.documentId,
    })
  );

