const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * returns all sent work items in a particular section
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, () => {
    const user = getUserFromAuthHeader(event);
    const userId = event.pathParameters.userId;
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUseCases().getSentWorkItemsForUser({
      applicationContext,
      userId,
    });
  });
