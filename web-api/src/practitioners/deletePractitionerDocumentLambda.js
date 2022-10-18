const { genericHandler } = require('../genericHandler');

/**
 * deletes a practitioner document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.deletePractitionerDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .deletePractitionerDocumentInteractor(applicationContext, {
        barNumber: event.pathParameters.barNumber,
        documentId: event.pathParameters.documentId,
      });
  });
