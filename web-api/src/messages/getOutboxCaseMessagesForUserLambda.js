const { genericHandler } = require('../genericHandler');

/**
 * gets the outbox case messages for the user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getOutboxCaseMessagesForUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getOutboxCaseMessagesForUserInteractor({
        applicationContext,
        userId: event.pathParameters.userId,
      });
  });
