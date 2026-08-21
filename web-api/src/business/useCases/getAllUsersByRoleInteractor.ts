import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUsersByRoles } from '@web-api/persistence/postgres/users/getUsersByRoles';
import { Role } from '@shared/business/entities/EntityConstants';

export const getAllUsersByRoleInteractor = async (
  { roles }: { roles: Role[] },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const results = await getUsersByRoles({ roles });

  return results;
};
