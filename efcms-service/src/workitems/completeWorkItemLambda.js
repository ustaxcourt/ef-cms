const createApplicationContext = require('../applicationContext');
const {
  handle,
  getUserFromAuthHeader,
} = require('../middleware/apiGatewayHelper');

/**
 * updates a work item
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const results = applicationContext.getUseCases().completeWorkItem({
        applicationContext,
        completedMessage: JSON.parse(event.body).completedMessage,
        workItemId: event.pathParameters.workItemId,
      });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
