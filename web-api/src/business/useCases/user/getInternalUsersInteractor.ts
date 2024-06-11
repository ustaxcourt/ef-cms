import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '../../../../../shared/src/business/entities/User';

/**
 * getInternalUsersInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<User[]>} the internal users
 */
export const getInternalUsersInteractor = async (
  applicationContext: ServerApplicationContext,
) => {
  if (
    !isAuthorized(
      applicationContext.getCurrentUser(),
      ROLE_PERMISSIONS.WORKITEM,
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const rawUsers = await applicationContext
    .getPersistenceGateway()
    .getInternalUsers({
      applicationContext,
    });

  return User.validateRawCollection(rawUsers, { applicationContext });
};
