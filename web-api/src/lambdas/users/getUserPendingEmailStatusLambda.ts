import { genericHandler } from '../../genericHandler';

/**
 * gets the user pending email
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUserPendingEmailStatusLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getUserPendingEmailStatusInteractor(applicationContext, {
        userId: event.pathParameters.userId,
      });
  });
