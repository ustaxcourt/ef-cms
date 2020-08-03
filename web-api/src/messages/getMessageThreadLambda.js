const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for retrieving messages by the parent message id
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getMessageThreadLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().getMessageThreadInteractor({
      applicationContext,
      parentMessageId: event.pathParameters.parentMessageId,
    });
  });
