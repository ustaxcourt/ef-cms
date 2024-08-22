import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '../../../../../shared/src/business/entities/User';

/**
 * getInternalUsersInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<User[]>} the internal users
 */
export const getInternalUsersInteractor = async (
  applicationContext: ServerApplicationContext,
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const rawUsers = await applicationContext
    .getPersistenceGateway()
    .getInternalUsers({
      applicationContext,
    });

  return User.validateRawCollection(rawUsers);
};
