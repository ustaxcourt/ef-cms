import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getUsersPendingEmailInteractor } from '@web-api/business/useCases/user/getUsersPendingEmailInteractor';

/**
 * calls the interactor for obtaining a mapping of a given array of userIds and
 * their associated pending email addresses (if they exist)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUsersPendingEmailLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const userIds = event.queryStringParameters.userIds?.split(',') || [];

      return await getUsersPendingEmailInteractor(
        applicationContext,
        {
          userIds,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
