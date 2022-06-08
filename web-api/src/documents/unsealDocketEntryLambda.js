const { genericHandler } = require('../genericHandler');

/**
 * used for unsealing docket entries
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.unsealDocketEntryLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      pathParameters: { docketEntryId, docketNumber },
    } = event;

    return await applicationContext
      .getUseCases()
      .unsealDocketEntryInteractor(applicationContext, {
        docketEntryId,
        docketNumber,
      });
  });
