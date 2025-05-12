import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export const getUserPendingEmailInteractor = async (
  { userId }: { userId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL)) {
    throw new UnauthorizedError('Unauthorized to get user pending email');
  }

  const userRaw = await getUserById({ userId });

  if (!userRaw) return;

  const validatedUserRaw = new User(userRaw).validate().toRawObject();

  return validatedUserRaw.pendingEmail;
};
