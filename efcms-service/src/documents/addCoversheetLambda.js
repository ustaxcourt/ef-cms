const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * used for adding a coversheet to a new document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const { caseId, documentId } = event.pathParameters;
    applicationContext.logger.info('Event', event);
    try {
      await applicationContext.getUseCases().addCoverToPDFDocument({
        applicationContext,
        caseId,
        documentId,
      });
      applicationContext.logger.info('User', user);
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
