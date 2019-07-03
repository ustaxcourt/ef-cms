const createApplicationContext = require('../applicationContext');
const {
  getUserFromAuthHeader,
  handle,
} = require('../middleware/apiGatewayHelper');

/**
 * creates a new document and attaches it to a case.  It also creates a work item on the docket section.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const {documentId} = event.pathParameters;
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const results = await applicationContext.getUseCases().virusScanPdf({
        applicationContext,
        documentId,
      });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
