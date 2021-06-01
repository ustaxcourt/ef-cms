const { genericHandler } = require('../genericHandler');

/**
 * gets the user pending email
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getUserPendingEmailStatusLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getUserPendingEmailStatusInteractor(applicationContext, {
        userId: event.pathParameters.userId,
      });
  });
