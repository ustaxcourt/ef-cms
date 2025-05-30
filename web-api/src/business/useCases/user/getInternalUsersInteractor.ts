import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { getAllUsersByRole } from '@web-api/persistence/postgres/users/getAllUsersByRole';
import { INTERNAL_ROLES } from '@shared/business/entities/EntityConstants';

export const getInternalUsersInteractor = async (
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const rawUsers = await getAllUsersByRole({
    roles: Object.values(INTERNAL_ROLES) as string[],
  });

  return User.validateRawCollection(rawUsers);
};
