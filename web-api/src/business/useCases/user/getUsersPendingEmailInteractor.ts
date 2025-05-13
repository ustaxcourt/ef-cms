import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { getUsersById } from '@web-api/persistence/postgres/users/getUsersById';

export const getUsersPendingEmailInteractor = async (
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

  const usersRaw = await getUsersById({ userIds });

  if (!usersRaw || !usersRaw.length) return;

  const usersMapping = {};

  usersRaw.forEach(userRaw => {
    const validatedUserRaw = new User(userRaw).validate().toRawObject();

    usersMapping[validatedUserRaw.userId] = validatedUserRaw.pendingEmail;
  });

  return usersMapping;
};
