const { getAuthHeader, handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * GET WorkItems API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.get = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    return applicationContext.getUseCases().getWorkItems({ userId: userId, applicationContext});
  });
