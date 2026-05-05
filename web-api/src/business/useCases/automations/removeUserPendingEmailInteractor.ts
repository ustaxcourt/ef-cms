import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';

export const removeUserPendingEmailInteractor = async (
  { userId }: { userId: string },
  authorizedUser: UnknownAuthUser,
): Promise<string> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.REMOVE_USER_PENDING_EMAIL)
  ) {
    throw new UnauthorizedError(`Unauthorized`);
  }

  const user = await getUserById({ userId });

  if (!user) {
    throw new NotFoundError(`Did not find ${userId} in database`);
  }

  if (!user.email) {
    return `User ${userId} has not yet activated their account; keeping 'pendingEmail' field`;
  }

  user.pendingEmail = undefined;
  user.pendingEmailVerificationToken = undefined;

  await upsertUsers([user]);

  return `Removed pending email for user ${userId}`;
};
