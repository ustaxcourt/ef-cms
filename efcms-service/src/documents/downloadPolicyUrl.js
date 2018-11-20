const { redirect } = require('../middleware/apiGatewayHelper');

const {
  persistence: { getDocumentDownloadUrl },
  environment: { region, documentsBucketName, s3Endpoint },
} = require('../applicationContext');

const applicationContext = {
  persistence: {
    getDocumentDownloadUrl,
  },
  environment: {
    region,
    s3Endpoint,
    documentsBucketName,
  },
};

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
      applicationContext,
    }),
  );
