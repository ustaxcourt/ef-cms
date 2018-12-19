const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * getWorkItem
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.get = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    const applicationContext = createApplicationContext({ userId });
    return applicationContext.getUseCases().getWorkItem({
      userId: getAuthHeader(event),
      workItemId: event.pathParameters.workItemId,
      applicationContext,
    });
  });
