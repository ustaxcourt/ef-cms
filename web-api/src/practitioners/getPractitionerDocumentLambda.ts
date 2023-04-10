const { genericHandler } = require('../genericHandler');

/**
 * Returns a practitioner document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getPractitionerDocumentLambda = event =>
  genericHandler(event, ({ applicationContext }) => {
    return applicationContext
      .getUseCases()
      .getPractitionerDocumentInteractor(applicationContext, {
        barNumber: event.pathParameters.barNumber,
        practitionerDocumentFileId:
          event.pathParameters.practitionerDocumentFileId,
      });
  });
