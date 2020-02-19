const { genericHandler } = require('../genericHandler');

/**
 * used for removing pending items from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { caseId, documentId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .removeCasePendingItemInteractor({
        applicationContext,
        caseId,
        documentId,
      });
  });
