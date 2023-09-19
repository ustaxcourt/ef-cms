import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used to forward a message
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const forwardMessageLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .forwardMessageInteractor(applicationContext, {
        parentMessageId: event.pathParameters.parentMessageId,
        ...JSON.parse(event.body),
      });
  });
