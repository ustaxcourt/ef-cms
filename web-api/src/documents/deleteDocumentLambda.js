const { genericHandler } = require('../genericHandler');

/**
 * deletes a document from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.deleteDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().deleteDocumentInteractor({
      applicationContext,
      ...event.pathParameters,
    });
  });
