import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '../../../../../shared/src/business/entities/User';

/**
 * getUsersPendingEmailInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {array} providers.userIds an array of userIds
 * @returns {object} a map of userIds and their corresponding emails
 */
export const getUsersPendingEmailInteractor = async (
  applicationContext: ServerApplicationContext,
  { userIds }: { userIds: string[] },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(
      authorizedUser,
      ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL_STATUS,
    )
  ) {
    throw new UnauthorizedError("Unauthorized to get users' pending emails");
  }

  const usersRaw = await applicationContext
    .getPersistenceGateway()
    .getUsersById({
      applicationContext,
      userIds,
    });

  if (!usersRaw || !usersRaw.length) return;

  const usersMapping = {};

  usersRaw.forEach(userRaw => {
    const validatedUserRaw = new User(userRaw).validate().toRawObject();

    usersMapping[validatedUserRaw.userId] = validatedUserRaw.pendingEmail;
  });

  return usersMapping;
};
