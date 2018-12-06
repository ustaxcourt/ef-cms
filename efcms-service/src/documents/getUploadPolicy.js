const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');
const {
  getUploadPolicy
} = require('../../../shared/src/persistence/getUploadPolicy');
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
    getUploadPolicy({
      applicationContext,
    }),
  );
