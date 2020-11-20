const { genericHandler } = require('../genericHandler');

/**
 * used for removing a pdf from a docket entry
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.removePdfFromDocketEntryLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .removePdfFromDocketEntryInteractor({
        applicationContext,
        ...event.pathParameters,
      });
  });
