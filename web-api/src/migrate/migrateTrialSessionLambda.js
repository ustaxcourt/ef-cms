const { genericHandler } = require('../genericHandler');

/**
 * creates a new trial session from pre-existing trial session data
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.migrateTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getMigrations()
      .migrateTrialSessionInteractor({
        applicationContext,
        trialSessionMetadata: JSON.parse(event.body),
      });
  });
