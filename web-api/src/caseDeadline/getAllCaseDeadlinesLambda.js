const { genericHandler } = require('../genericHandler');

/**
 * get all case deadlines
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getAllCaseDeadlinesInteractor({
        applicationContext,
      });
  });
