const { genericHandler } = require('../genericHandler');

/**
 * used for adding a draft stamp order docket entry
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

    return await applicationContext
      .getUseCases()
      .addDraftStampOrderDocketEntryInteractor(applicationContext, {
        ...JSON.parse(body),
        docketNumber,
        originalDocketEntryId,
      });
  });
