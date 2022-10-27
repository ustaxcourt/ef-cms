const { genericHandler } = require('../genericHandler');

/**
 * creates a practitioner document for a practitioner
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.editPractitionerDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .editPractitionerDocumentInteractor(applicationContext, {
        barNumber: event.pathParameters.barNumber,
        documentMetadata: JSON.parse(event.body),
      });
  });
