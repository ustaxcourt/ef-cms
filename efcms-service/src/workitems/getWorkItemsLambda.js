const { getUserFromAuthHeader, handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * returns all work items associated with a user
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.get = event =>
  handle(() => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const section = (event.queryStringParameters || {}).section;
    const completed = (event.queryStringParameters || {}).completed;
    return applicationContext.getWorkItemsInteractor(event)({
      section,
      completed,
      applicationContext,
    });
  });
