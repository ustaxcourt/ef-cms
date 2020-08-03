const { genericHandler } = require('../genericHandler');

/**
 * gets the completed messages for the user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getCompletedMessagesForUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCompletedMessagesForUserInteractor({
        applicationContext,
        userId: event.pathParameters.userId,
      });
  });
