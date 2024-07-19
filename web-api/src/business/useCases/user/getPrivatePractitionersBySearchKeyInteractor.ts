import { PrivatePractitioner } from '../../../../../shared/src/business/entities/PrivatePractitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 * getPrivatePractitionersBySearchKeyInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} params the params object
 * @param {string} params.searchKey the search string entered by the user
 * @returns {*} the result
 */
export const getPrivatePractitionersBySearchKeyInteractor = async (
  applicationContext: ServerApplicationContext,
  { searchKey }: { searchKey: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const users = await applicationContext
    .getPersistenceGateway()
    .getUsersBySearchKey({
      applicationContext,
      searchKey,
      type: 'privatePractitioner',
    });

  return PrivatePractitioner.validateRawCollection(users, {
    applicationContext,
  });
};
