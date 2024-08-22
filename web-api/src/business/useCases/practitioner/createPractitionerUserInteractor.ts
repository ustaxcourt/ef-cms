import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { RawPractitioner } from '../../../../../shared/src/business/entities/Practitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createPractitionerUser } from '../../../../../shared/src/business/utilities/createPractitionerUser';

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

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createOrUpdatePractitionerUser({
      applicationContext,
      user: practitioner,
    });

  return { barNumber: createdUser.barNumber };
};
