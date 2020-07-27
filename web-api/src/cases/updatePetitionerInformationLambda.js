const { genericHandler } = require('../genericHandler');

/**
 * used for updating a case's petitioner information
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updatePetitionerInformationLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updatePetitionerInformationInteractor({
        applicationContext,
        ...event.pathParameters,
        ...JSON.parse(event.body),
      });
  });
