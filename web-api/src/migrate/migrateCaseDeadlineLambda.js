const { genericHandler } = require('../genericHandler');

/**
 * creates a new case deadline record from pre-existing case deadline data
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.migrateCaseDeadlineLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getMigrations()
      .migrateCaseDeadlineInteractor({
        applicationContext,
        caseDeadlineMetadata: JSON.parse(event.body),
      });
  });
