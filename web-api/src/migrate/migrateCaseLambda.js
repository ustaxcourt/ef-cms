const { genericHandler } = require('../genericHandler');

/**
 * creates a new case record from pre-existing case data
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.migrateCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getMigrations().migrateCaseInteractor({
      applicationContext,
      caseMetadata: JSON.parse(event.body),
    });
  });
