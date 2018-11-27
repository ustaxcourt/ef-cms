const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');
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
/**
 * Create Upload Policy API Lambda
 */
exports.create = () =>
  handle(() =>
    uploadPolicyUseCase({
      applicationContext,
    }),
  );
