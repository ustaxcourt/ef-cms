import { genericHandler } from '../../genericHandler';

/**
 * gets the completed messages for the user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCompletedMessagesForUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCompletedMessagesForUserInteractor(applicationContext, {
        userId: event.pathParameters.userId,
      });
  });
