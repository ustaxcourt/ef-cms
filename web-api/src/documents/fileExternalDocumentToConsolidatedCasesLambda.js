const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for adding external documents to a set of consolidated cases
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.fileExternalDocumentToConsolidatedCasesLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .fileExternalDocumentForConsolidatedInteractor({
        applicationContext,
        ...JSON.parse(event.body),
        ...event.pathParameters,
      });
  });
