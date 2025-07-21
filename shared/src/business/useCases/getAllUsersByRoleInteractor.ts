import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export const getAllUsersByRoleInteractor = async (
  applicationContext: ServerApplicationContext,
  { roles }: { roles: string[] },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const results = await applicationContext
    .getPersistenceGateway()
    .getAllUsersByRole(applicationContext, roles);

  return results;
};
