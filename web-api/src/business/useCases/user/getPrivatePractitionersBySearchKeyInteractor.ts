import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getPractitionersBySearchKey } from '@web-api/persistence/postgres/practitioners/getPractitionersBySearchKey';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const getPrivatePractitionersBySearchKeyInteractor = async (
  { searchKey }: { searchKey: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const privatePractitioners = await getPractitionersBySearchKey({
    searchKey,
    role: ROLES.privatePractitioner,
  });

  return PrivatePractitioner.validateRawCollection(privatePractitioners);
};
