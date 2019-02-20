const { handle, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * updates a work item
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
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
