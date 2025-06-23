import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createOrUpdatePractitionerUser } from '@web-api/persistence/postgres/practitioners/createOrUpdatePractitionerUser';
import { createBarNumber } from '@web-api/persistence/postgres/practitioners/createBarNumber';

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

  const barNumber =
    user.barNumber ||
    (await createBarNumber({
      initials:
        user.lastName.charAt(0).toUpperCase() +
        user.firstName.charAt(0).toUpperCase(),
    }));

  const practitioner = new Practitioner({
    ...user,
    barNumber,
    userId: applicationContext.getUniqueId(),
  })
    .validate()
    .toRawObject();

  const createdUser = await createOrUpdatePractitionerUser({
    user: practitioner,
  });

  return { barNumber: createdUser.barNumber };
};
