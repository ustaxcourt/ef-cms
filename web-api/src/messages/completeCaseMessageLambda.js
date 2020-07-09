const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used to complete a case message thread
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.completeCaseMessageLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .completeCaseMessageInteractor({
        applicationContext,
        parentMessageId: event.pathParameters.parentMessageId,
        ...JSON.parse(event.body),
      });
  });
