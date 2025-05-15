import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createPractitionerUser } from '@shared/business/utilities/createPractitionerUser';
import { createOrUpdatePractitionerUser } from '@web-api/persistence/postgres/practitioners/createOrUpdatePractitionerUser';

export const createPractitionerUserInteractor = async (
  applicationContext: ServerApplicationContext,
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

  const practitioner = await createPractitionerUser(applicationContext, {
    user,
  });

  const createdUser = await createOrUpdatePractitionerUser({
    user: practitioner,
  });

  return { barNumber: createdUser.barNumber };
};
