const { genericHandler } = require('../genericHandler');

/**
 * used for updating a privatePractitioner or irsPractitioner on a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updateCounselOnCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateCounselOnCaseInteractor({
        applicationContext,
        ...event.pathParameters,
        userData: JSON.parse(event.body),
      });
  });
