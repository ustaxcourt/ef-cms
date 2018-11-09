const fileStorageService = require('../middleware/S3Service');
const { createDone } = require('../middleware/apiGatewayHelper');

/**
 * Create Document API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.create = (event, context, callback) => {
  const done = createDone(callback);
  fileStorageService
    .createUploadPolicy()
    .then(policy => {
      done(null, policy);
    })
    .catch(done);
};
