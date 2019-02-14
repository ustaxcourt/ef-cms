const { handle, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * updates a work item
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.put = event =>
  handle(() => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUpdateWorkItemInteractor(event)({
      ...JSON.parse(event.body),
      workItemId: event.pathParameters.workItemId,
      workItemToUpdate: JSON.parse(event.body),
      applicationContext,
    });
  });
