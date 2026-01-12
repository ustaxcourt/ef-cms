import { PrivatePractitioner } from '../../../../../shared/src/business/entities/PrivatePractitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getPractitionersBySearchKey } from '@web-api/persistence/postgres/users/getPractitionersBySearchKey';
import { ROLES } from '@shared/business/entities/EntityConstants';

/**
 * getPrivatePractitionersBySearchKeyInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} params the params object
 * @param {string} params.searchKey the search string entered by the user
 * @returns {*} the result
 */
export const getPrivatePractitionersBySearchKeyInteractor = async (
  { searchKey }: { searchKey: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const users = await getPractitionersBySearchKey({
    searchKey,
    role: ROLES.privatePractitioner,
  });

  return PrivatePractitioner.validateRawCollection(users);
};
