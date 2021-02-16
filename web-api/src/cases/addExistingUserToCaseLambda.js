const { genericHandler } = require('../genericHandler');

/**
 * will update the petitioner on the case to match the new email passed in and will
 * put that case on the petitioner's dashboard
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.addExistingUserToCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .addExistingUserToCaseInteractor({
        applicationContext,
        ...event.pathParameters,
        ...JSON.parse(event.body),
      });
  });
