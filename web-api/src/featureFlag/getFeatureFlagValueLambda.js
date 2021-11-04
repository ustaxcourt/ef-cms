const { genericHandler } = require('../genericHandler');

/**
 * gets the value of the provided feature flag
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getFeatureFlagValueLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor(applicationContext, event.pathParameters);
  });
