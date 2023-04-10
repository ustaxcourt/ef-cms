const { genericHandler } = require('../genericHandler');

/**
 * creates a new trial session.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.createTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .createTrialSessionInteractor(applicationContext, {
        trialSession: JSON.parse(event.body),
      });
  });
