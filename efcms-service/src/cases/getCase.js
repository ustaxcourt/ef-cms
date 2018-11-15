const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const caseMiddleware = require('./middleware/caseMiddleware');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * GET Case API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.get = event =>
  handle(() =>
    caseMiddleware.getCase({
      userId: getAuthHeader(event),
      caseId: event.pathParameters.caseId
    })
  );
