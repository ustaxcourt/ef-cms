const { createUploadPolicy } = require('./services/documentBlobDAO');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * Create Upload Policy API Lambda
 */
exports.create = () =>
  handle(() =>
    createUploadPolicy()
  )
