const { redirect } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

const {
  getDownloadPolicyUrl: downloadPolicyUseCase,
} = require('ef-cms-shared/src/persistence/getDownloadPolicyUrl');

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
