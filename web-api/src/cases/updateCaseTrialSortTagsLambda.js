const createApplicationContext = require('../applicationContext');
const {
  getUserFromAuthHeader,
  handle,
} = require('../middleware/apiGatewayHelper');

/**
 * updates case trial sort tags
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const results = await applicationContext
        .getUseCases()
        .updateCaseTrialSortTags({
          applicationContext,
          caseId: event.pathParameters.caseId,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
