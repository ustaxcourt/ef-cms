const { getAuthHeader, handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * GET WorkItems API Lambda
 *
 * @param event
 */

exports.get = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    const applicationContext = createApplicationContext({ userId });
    return applicationContext.getUseCases().getWorkItems({ userId: userId, applicationContext});
  });
