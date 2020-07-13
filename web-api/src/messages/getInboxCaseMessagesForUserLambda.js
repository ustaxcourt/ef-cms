const { genericHandler } = require('../genericHandler');

/**
 * gets the inbox case messages for the user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getInboxCaseMessagesForUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getInboxCaseMessagesForUserInteractor({
        applicationContext,
        userId: event.pathParameters.userId,
      });
  });
