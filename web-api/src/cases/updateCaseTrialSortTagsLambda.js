const { genericHandler } = require('../genericHandler');

/**
 * updates case trial sort tags
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updateCaseTrialSortTagsLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateCaseTrialSortTagsInteractor({
        applicationContext,
        ...event.pathParameters,
      });
  });
