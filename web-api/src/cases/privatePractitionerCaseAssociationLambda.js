const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for associating a user to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.privatePractitionerCaseAssociationLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .submitCaseAssociationRequestInteractor({
        applicationContext,
        ...event.pathParameters,
        ...JSON.parse(event.body),
      });
  });
