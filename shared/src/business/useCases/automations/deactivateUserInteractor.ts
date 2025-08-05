import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { getUserGateway } from '@web-api/getUserGateway';
import { applicationContext } from '@web-api/applicationContext';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { deactivateUser } from '@web-api/persistence/postgres/users/deactivateUser';

export const deactivateUserInteractor = async (
  { email }: { email: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DEACTIVATE_USER)) {
    throw new UnauthorizedError(`Unauthorized`);
  }

  const user = await getUserGateway().getUserByEmail(applicationContext, {
    email,
  });

  if (!user) {
    throw new NotFoundError(`Could not find user with email: ${email}`);
  }

  await settlePromises([
    getUserGateway().disableUser({ email }),
    deactivateUser({ userId: user.userId }),
  ]);
};
