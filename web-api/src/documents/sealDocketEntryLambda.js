const { genericHandler } = require('../genericHandler');

/**
 * used for sealing docket records
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.sealDocketEntryLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      pathParameters: { docketEntryId, docketNumber },
    } = event;

    const { docketEntrySealedTo } = JSON.parse(event.body);

    return await applicationContext
      .getUseCases()
      .sealDocketEntryInteractor(applicationContext, {
        docketEntryId,
        docketEntrySealedTo,
        docketNumber,
      });
  });
