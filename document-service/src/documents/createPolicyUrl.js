const fileStorageService = require('../services/fileStorageService');
const { createDone } = require('../services/gatewayHelper');

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
