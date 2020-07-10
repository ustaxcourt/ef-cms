const { genericHandler } = require('../genericHandler');

/**
 * gets the completed case messages for the user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getCompletedCaseMessagesForUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCompletedCaseMessagesForUserInteractor({
        applicationContext,
        userId: event.pathParameters.userId,
      });
  });
