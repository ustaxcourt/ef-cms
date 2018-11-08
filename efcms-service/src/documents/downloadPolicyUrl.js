const fileStorageService = require('../middleware/S3Service');
const { createDone } = require('../middleware/apiGatewayHelper');

/**
 * GET Pre-signed Policy URL API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.create = (event, context, callback) => {
  const done = createDone(callback);
  fileStorageService
    .createDownloadPolicy()
    .then(policy => {
      done(null, policy);
    })
    .catch(done);
};
