const s3Service = require('../middleware/S3Service');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * GET Pre-signed Policy URL API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */
exports.get = async event =>
  handle(() =>
    s3Service.createDownloadPolicy(
      event.pathParameters.documentId
    )
  );
