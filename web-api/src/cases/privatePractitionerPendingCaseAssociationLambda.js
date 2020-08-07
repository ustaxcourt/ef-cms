const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for creating a pending association of a user to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.privatePractitionerPendingCaseAssociationLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .submitPendingCaseAssociationRequestInteractor({
        applicationContext,
        ...event.pathParameters,
      });
  });
