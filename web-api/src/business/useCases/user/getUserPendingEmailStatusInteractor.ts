import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '../../../../../shared/src/business/entities/User';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export const getUserPendingEmailStatusInteractor = async (
  _: ServerApplicationContext,
  { userId }: { userId: string },
  authorizedUser: UnknownAuthUser,
): Promise<boolean> => {
  if (
    !isAuthorized(
      authorizedUser,
      ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL_STATUS,
    )
  ) {
    throw new UnauthorizedError(
      'Unauthorized to get user pending email status',
    );
  }

  const userRaw = await getUserById({
    userId,
  });

  if (!userRaw) return false;

  const validatedUserRaw = new User(userRaw).validate().toRawObject();

  return !!validatedUserRaw.pendingEmail;
};
