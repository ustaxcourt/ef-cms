const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * assigns a list of work item ids to an assignee
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.assign = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    const applicationContext = createApplicationContext({ userId });
    const workItems = JSON.parse(event.body);
    return applicationContext.getUseCases().assignWorkItems({
      userId: getAuthHeader(event),
      workItems: workItems,
      applicationContext,
    });
  });
