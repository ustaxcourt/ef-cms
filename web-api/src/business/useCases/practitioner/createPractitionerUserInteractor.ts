import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { RawPractitioner } from '../../../../../shared/src/business/entities/Practitioner';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { upsertPractitioner } from '@web-api/persistence/postgres/users/upsertPractitioner';
import { createPractitionerUser } from '@shared/business/utilities/createPractitionerUser';

export const createPractitionerUserInteractor = async (
  { user }: { user: RawPractitioner },
  authorizedUser: UnknownAuthUser,
): Promise<{ barNumber: string }> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_EDIT_PRACTITIONER_USER)
  ) {
    throw new UnauthorizedError('Unauthorized for creating practitioner user');
  }

  user.pendingEmail = user.email;
  user.email = undefined;

  const practitioner = await createPractitionerUser({
    user,
  });

  await upsertPractitioner({
    user: practitioner,
  });

  return { barNumber: practitioner.barNumber };
};
