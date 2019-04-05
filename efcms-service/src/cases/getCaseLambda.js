const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * used for fetching a single case
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const caseDetail = await applicationContext.getUseCases().getCase({
        applicationContext,
        caseId: event.pathParameters.caseId,
      });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Case', caseDetail);
      return caseDetail;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
