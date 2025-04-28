import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getAllUsersByRole } from '@web-api/persistence/postgres/users/getAllUsersByRole';

export const getAllUsersByRoleInteractor = async (
  { roles }: { roles: string[] },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const results = await getAllUsersByRole({ roles });

  return results;
};
