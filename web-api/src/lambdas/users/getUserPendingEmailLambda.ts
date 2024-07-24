import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getUserPendingEmailInteractor } from '@web-api/business/useCases/user/getUserPendingEmailInteractor';

/**
 * gets the user pending email
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUserPendingEmailLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getUserPendingEmailInteractor(
      applicationContext,
      {
        userId: event.pathParameters.userId,
      },
      authorizedUser,
    );
  });
