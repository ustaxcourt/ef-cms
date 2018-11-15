const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const caseMiddleware = require('./middleware/caseMiddleware');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * Create Case API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.create = event =>
  handle(() =>
    caseMiddleware.create({
      userId: getAuthHeader(event),
      documents: JSON.parse(event.body).documents,
      user: JSON.parse(event.body).user
    })
  );
