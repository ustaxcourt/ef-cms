import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used to complete a message thread
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const completeMessageLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .completeMessageInteractor(applicationContext, {
        parentMessageId: event.pathParameters.parentMessageId,
        ...JSON.parse(event.body),
      });
  });
