const createApplicationContext = require('../applicationContext');
const {
  getUserFromAuthHeader,
  handle,
} = require('../middleware/apiGatewayHelper');

/**
 * used for serving a court-issued document on all parties and closing the case for some document types
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const { caseId, documentId } = event.pathParameters;
      const results = await applicationContext
        .getUseCases()
        .serveCourtIssuedDocumentInteractor({
          applicationContext,
          caseId,
          documentId,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Case ID', caseId);
      applicationContext.logger.info('Document ID', documentId);
      applicationContext.logger.info('Results', results.updatedCase);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
