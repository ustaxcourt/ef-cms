const { genericHandler } = require('../genericHandler');

/**
 * used for getting the document contents for a docket entry
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getDocumentContentsForDocketEntryLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getDocumentContentsForDocketEntryInteractor(
        applicationContext,
        event.pathParameters,
      );
  });
