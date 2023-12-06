import { genericHandler } from '../../genericHandler';

/**
 * gets the outbox messages for the user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getOutboxMessagesForUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getOutboxMessagesForUserInteractor(applicationContext, {
        userId: event.pathParameters.userId,
      });
  });
