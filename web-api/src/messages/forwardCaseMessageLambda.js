const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used to forward a case message
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.forwardCaseMessageLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().forwardCaseMessageInteractor({
      applicationContext,
      parentMessageId: event.pathParameters.parentMessageId,
      ...JSON.parse(event.body),
    });
  });
