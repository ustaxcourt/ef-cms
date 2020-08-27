const { genericHandler } = require('../genericHandler');

/**
 * updates the user contact info (used for a privatePractitioner or irsPractitioner)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updateUserContactInformationLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateUserContactInformationInteractor({
        applicationContext,
        contactInfo: JSON.parse(event.body),
        userId: (event.pathParameters || event.path).userId,
      });
  });
