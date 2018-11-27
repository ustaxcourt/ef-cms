const { handle } = require('../middleware/apiGatewayHelper');
const {
  createUploadPolicy: uploadPolicyUseCase,
} = require('ef-cms-shared/src/useCases/createPolicyUrl');
/**
 * Create Document API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

const {
  persistence: { createUploadPolicy },
  environment: { s3Endpoint, region, documentsBucketName },
} = require('../applicationContext');

const applicationContext = {
  persistence: {
    createUploadPolicy,
  },
  environment: {
    s3Endpoint,
    region,
    documentsBucketName,
  },
};

/**
 * Create Upload Policy API Lambda
 */
exports.create = () =>
  handle(() =>
    uploadPolicyUseCase({
      applicationContext,
    }),
  );
