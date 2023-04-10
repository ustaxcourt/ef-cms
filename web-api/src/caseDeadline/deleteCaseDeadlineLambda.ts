const { genericHandler } = require('../genericHandler');

/**
 * delete case deadline
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.deleteCaseDeadlineLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .deleteCaseDeadlineInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
