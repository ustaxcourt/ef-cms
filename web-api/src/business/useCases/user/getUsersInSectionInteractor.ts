import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import {
  RawUser,
  User,
} from '../../../../../shared/src/business/entities/User';
import { UnauthorizedError } from '../../../errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUsersInSection } from '@web-api/persistence/postgres/users/getUsersInSection';

export const getUsersInSectionInteractor = async (
  { section }: { section: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawUser[]> => {
  let rolePermission;

  if (section === 'judge') {
    rolePermission = ROLE_PERMISSIONS.GET_JUDGES;
  } else {
    rolePermission = ROLE_PERMISSIONS.GET_USERS_IN_SECTION;
  }

  if (!!authorizedUser && !isAuthorized(authorizedUser, rolePermission)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const rawUsers = await getUsersInSection({
    section,
  });

  return User.validateRawCollection(rawUsers);
};
