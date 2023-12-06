import { genericHandler } from '../../genericHandler';

/**
 * gets the inbox messages for the user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getInboxMessagesForUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getInboxMessagesForUserInteractor(applicationContext, {
        userId: event.pathParameters.userId,
      });
  });
