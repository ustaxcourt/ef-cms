const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for adding a court issued docket entry
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.fileCourtIssuedDocketEntryLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .fileCourtIssuedDocketEntryInteractor({
        ...JSON.parse(event.body),
        applicationContext,
      });
  });
