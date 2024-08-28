import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getUserPendingEmailStatusInteractor } from '@web-api/business/useCases/user/getUserPendingEmailStatusInteractor';

/**
 * gets the user pending email
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUserPendingEmailStatusLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getUserPendingEmailStatusInteractor(
      applicationContext,
      {
        userId: event.pathParameters.userId,
      },
      authorizedUser,
    );
  });
