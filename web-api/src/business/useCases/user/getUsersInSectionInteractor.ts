import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawUser, User } from '@shared/business/entities/User';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUsersInSections } from '@web-api/persistence/postgres/users/getUsersInSection';
import {
  CASE_SERVICES_SUPERVISOR_SECTION,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';

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

  const sectionsToSearch = [section];
  if (section === DOCKET_SECTION || section === PETITIONS_SECTION) {
    sectionsToSearch.push(CASE_SERVICES_SUPERVISOR_SECTION);
  }

  const users = await getUsersInSections({
    sections: sectionsToSearch,
  });

  return User.validateRawCollection(users);
};
