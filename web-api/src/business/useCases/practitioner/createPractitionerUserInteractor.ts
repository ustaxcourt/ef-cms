import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { upsertPractitioner } from '@web-api/persistence/postgres/users/upsertPractitioner';
import { createPractitionerUser } from '@shared/business/utilities/createPractitionerUser';
import { userDataCanGenerateValidBarNumber } from '@shared/business/utilities/userDataCanGenerateValidBarNumber';

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
  user.firstName = user.firstName.trim();
  user.lastName = user.lastName.trim();

  if (
    !userDataCanGenerateValidBarNumber({
      firstName: user.firstName,
      lastName: user.lastName,
    })
  ) {
    throw new InvalidRequest(
      'Unable to generate a bar number: first and last names must start with a letter after trimming whitespace.',
    );
  }

  const practitioner = await createPractitionerUser({ user });

  await upsertPractitioner({ user: practitioner });

  return { barNumber: practitioner.barNumber };
};
