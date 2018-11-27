const { redirect } = require('../middleware/apiGatewayHelper');
const {
  getDownloadPolicyUrl: downloadPolicyUseCase,
} = require('ef-cms-shared/src/useCases/getDownloadPolicyUrl');

const {
  persistence: { getDownloadPolicyUrl },
  environment: { region, documentsBucketName, s3Endpoint },
} = require('../applicationContext');

const applicationContext = {
  persistence: {
    getDownloadPolicyUrl,
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
    downloadPolicyUseCase({
      documentId: event.pathParameters.documentId,
      applicationContext,
    }),
  );
