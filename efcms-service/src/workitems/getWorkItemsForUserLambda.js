const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * returns the users inbox
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, () => {
    const user = getUserFromAuthHeader(event);
    const userId = event.pathParameters.userId;
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUseCases().getWorkItemsForUser({
      userId,
      applicationContext,
    });
  });
