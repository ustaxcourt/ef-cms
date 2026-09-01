import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  PublicContact,
  RawPublicContact,
} from '@shared/business/entities/cases/PublicContact';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getPractitionerByBarNumber } from '@web-api/persistence/postgres/users/getPractitionerByBarNumber';

export const getPractitionerByBarNumberInteractor = async (
  _applicationContext: ServerApplicationContext,
  { barNumber }: { barNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawPractitioner | RawPublicContact[] | undefined> => {
  const isLoggedInUser = !!authorizedUser?.userId;

  if (
    isLoggedInUser &&
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)
  ) {
    throw new UnauthorizedError('Unauthorized for getting attorney user');
  }
  const foundPractitioner = await getPractitionerByBarNumber({ barNumber });

  let practitioner: RawPractitioner | undefined;

  if (foundPractitioner) {
    practitioner = new Practitioner(foundPractitioner).validate().toRawObject();
  }

  return isLoggedInUser
    ? practitioner
    : practitioner
      ? [
          new PublicContact({
            ...practitioner,
            state: practitioner.originalBarState,
          }).toRawObject(),
        ]
      : []; // return empty array for public user if no practitioner found
};
