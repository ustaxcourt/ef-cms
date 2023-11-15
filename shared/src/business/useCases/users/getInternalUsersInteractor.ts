import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '../../entities/User';

/**
 * getInternalUsersInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<User[]>} the internal users
 */
export const getInternalUsersInteractor = async (
  applicationContext: IApplicationContext,
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
