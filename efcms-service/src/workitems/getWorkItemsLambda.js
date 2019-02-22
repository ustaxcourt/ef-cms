const { getUserFromAuthHeader, handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * returns all work items associated with a user
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, () => {
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
