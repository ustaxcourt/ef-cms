import { genericHandler } from '../../genericHandler';

/**
 * gets the user pending email
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUserPendingEmailLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getUserPendingEmailInteractor(applicationContext, {
        userId: event.pathParameters.userId,
      });
  });
