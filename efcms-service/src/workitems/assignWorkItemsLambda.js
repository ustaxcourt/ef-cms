const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
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
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const workItems = JSON.parse(event.body);
    return applicationContext.getUseCases().assignWorkItems({
      workItems: workItems,
      applicationContext,
    });
  });
