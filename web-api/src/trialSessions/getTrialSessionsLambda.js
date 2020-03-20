const { genericHandler } = require('../genericHandler');

/**
 * gets all trial sessions
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getTrialSessionsLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().getTrialSessionsInteractor({
      applicationContext,
    });
  });
