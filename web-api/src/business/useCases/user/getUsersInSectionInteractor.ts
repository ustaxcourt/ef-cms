import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import {
  RawUser,
  User,
} from '../../../../../shared/src/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '../../../errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const getUsersInSectionInteractor = async (
  applicationContext: ServerApplicationContext,
  { section }: { section: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawUser[]> => {
  let rolePermission;

  if (section === 'judge') {
    rolePermission = ROLE_PERMISSIONS.GET_JUDGES;
  } else {
    rolePermission = ROLE_PERMISSIONS.GET_USERS_IN_SECTION;
  }

  if (!isAuthorized(authorizedUser, rolePermission)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const rawUsers: User[] = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section,
    });

  return User.validateRawCollection(rawUsers);
};
