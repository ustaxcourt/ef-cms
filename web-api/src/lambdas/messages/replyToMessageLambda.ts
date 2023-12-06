import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used to reply to a message
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const replyToMessageLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .replyToMessageInteractor(applicationContext, {
        parentMessageId: event.pathParameters.parentMessageId,
        ...JSON.parse(event.body),
      });
  });
