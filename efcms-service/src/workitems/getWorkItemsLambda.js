const { getAuthHeader, handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * returns all work items associated with a user
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.get = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    const applicationContext = createApplicationContext({ userId });
    const section = (event.queryStringParameters || {}).section;
    return applicationContext.getWorkItemsInteractor(event)({ userId: userId, section, applicationContext});
  });
