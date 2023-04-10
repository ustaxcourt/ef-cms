const { genericHandler } = require('../genericHandler');

/**
 * used for signing PDF documents
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.saveSignedDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      body,
      pathParameters: { docketEntryId: originalDocketEntryId, docketNumber },
    } = event;

    return await applicationContext
      .getUseCases()
      .saveSignedDocumentInteractor(applicationContext, {
        ...JSON.parse(body),
        docketNumber,
        originalDocketEntryId,
      });
  });
