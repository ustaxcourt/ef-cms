const { genericHandler } = require('../genericHandler');

/**
 * used for adding a coversheet to a new document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    applicationContext.logger.info('Event', event);
    const { caseId, documentId } = event.pathParameters || {};

    return await applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      caseId,
      documentId,
    });
  });
