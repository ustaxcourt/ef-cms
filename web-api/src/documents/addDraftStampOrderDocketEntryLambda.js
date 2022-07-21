const { genericHandler } = require('../genericHandler');

/**
 * used for stamping PDF documents
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.addDraftStampOrderDocketEntryLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      body,
      pathParameters: { docketEntryId: originalDocketEntryId, docketNumber },
    } = event;

    console.log('body in lambda', body);
    return await applicationContext
      .getUseCases()
      .addDraftStampOrderDocketEntryInteractor(applicationContext, {
        ...JSON.parse(body),
        docketNumber,
        originalDocketEntryId,
      });
  });
