const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * returns a single work item via the workItemId passed in the path of the url
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.get = event =>
  handle(() => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUseCases().getWorkItem({
      workItemId: event.pathParameters.workItemId,
      applicationContext,
    });
  });
