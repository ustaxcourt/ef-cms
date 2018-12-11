const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * GET Cases API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.get = event =>
  handle(() => {
    const status = (event.queryStringParameters || {}).status;
    const userId = getAuthHeader(event);
    return applicationContext.getUseCases().getCases({ userId: userId, status: status, applicationContext});
  });
