import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';
import { User } from '../../entities/User';

/**
 * getUsersPendingEmailInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {array} providers.userIds an array of userIds
 * @returns {object} a map of userIds and their corresponding emails
 */
export const getUsersPendingEmailInteractor = async (
  applicationContext: IApplicationContext,
  { userIds }: { userIds: string[] },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

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
