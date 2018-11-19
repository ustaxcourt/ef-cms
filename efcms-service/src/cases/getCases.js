const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const caseMiddleware = require('./middleware/caseMiddleware');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * GET Cases API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.get = event =>
  handle(() => {
    const status = (event.queryStringParameters || {}).status
    const userId = getAuthHeader(event);
    return status ?
      caseMiddleware.getCasesByStatus({ status, userId }) :
      caseMiddleware.getCases({ userId });
  });