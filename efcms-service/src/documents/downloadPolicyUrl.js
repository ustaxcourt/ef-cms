const { getDocumentDownloadUrl } = require('./services/documentBlobDAO');
// const { handle } = require('../middleware/apiGatewayHelper');

/**
 * GET Pre-signed Policy URL API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */
exports.get = async event => {
  const { url } = await getDocumentDownloadUrl({
    documentId: event.pathParameters.documentId,
  });
  return { status: 302, headers: { Location: url } }
}
