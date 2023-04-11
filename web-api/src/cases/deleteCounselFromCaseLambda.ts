const { genericHandler } = require('../genericHandler');

/**
 * used for deleting a privatePractitioner or irsPractitioner from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.deleteCounselFromCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .deleteCounselFromCaseInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
