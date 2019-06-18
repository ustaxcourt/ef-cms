const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * used for sanitizing PDF documents
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const { documentId } = event.pathParameters;

    applicationContext.logger.info('Event', event);
    try {
      const result = await applicationContext.getUseCases().validatePdf({
        applicationContext,
        documentId,
      });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Validate PDF Result', result);

      return result;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
