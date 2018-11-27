const { createDocument } = require('./services/documentBlobDAO');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * Create Document API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.create = event =>
  handle(() =>
    createDocument(JSON.parse(event.body))
  )
