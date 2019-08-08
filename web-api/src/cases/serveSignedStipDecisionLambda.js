const createApplicationContext = require('../applicationContext');
const {
  getUserFromAuthHeader,
  handle,
} = require('../middleware/apiGatewayHelper');

/**
 * used for serving a stipulated decision on all parties and closing a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const { caseId, documentId } = JSON.parse(event.body);
      const results = await applicationContext
        .getUseCases()
        .serveSignedStipDecisionInteractor({
          applicationContext,
          caseId,
          documentId,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Case ID', caseId);
      applicationContext.logger.info('Document ID', documentId);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
