const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for creating a new case message
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getCaseMessageLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().getCaseMessageInteractor({
      applicationContext,
      messageId: event.pathParameters.messageId,
    });
  });
