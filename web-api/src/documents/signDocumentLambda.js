const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * used for signing PDF documents
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const {
      body,
      pathParameters: { caseId, documentId: originalDocumentId },
    } = event;

    const { signedDocumentId } = JSON.parse(body);

    applicationContext.logger.info('Event', event);
    try {
      await applicationContext.getUseCases().saveSignedDocument({
        applicationContext,
        caseId,
        originalDocumentId,
        signedDocumentId,
      });
      applicationContext.logger.info('User', user);
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
