import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const getAllUsersByRoleInteractor = async (
  applicationContext: IApplicationContext,
  { roles }: { roles: string[] },
) => {
  const authorizedUser = applicationContext.getCurrentUser();
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const results = await applicationContext
    .getPersistenceGateway()
    .getAllUsersByRole(applicationContext, roles);

  return results;
};
