const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * returns all sent work items in a particular section
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(() => {
    const user = getUserFromAuthHeader(event);
    const userId = event.pathParameters.userId;
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUseCases().getSentWorkItemsForUser({
      userId,
      applicationContext,
    });
  });
