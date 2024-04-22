import { ROLES } from '../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { RawUser, User } from '../entities/User';
import { UnauthorizedError } from '../../../../web-api/src/errors/errors';

/**
 * getUserByIdInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} userId the id for the user to get
 * @returns {User} the retrieved user
 */
export const getUserByIdInteractor = async (
  applicationContext: IApplicationContext,
  { userId }: { userId: string },
): Promise<RawUser> => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)) {
    throw new UnauthorizedError('Unauthorized for getting practitioner user');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  if (![ROLES.privatePractitioner, ROLES.irsPractitioner].includes(user.role)) {
    throw new UnauthorizedError(
      'Unauthorized to retrieve users other than practitioners',
    );
  }

  return new User(user).validate().toRawObject();
};
