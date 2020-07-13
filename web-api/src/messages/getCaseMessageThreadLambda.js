const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for retrieving case messages by the parent message id
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getCaseMessageThreadLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCaseMessageThreadInteractor({
        applicationContext,
        parentMessageId: event.pathParameters.parentMessageId,
      });
  });
