import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getPractitionerByBarNumber } from '@web-api/persistence/postgres/users/getPractitionerByBarNumber';

export const getPractitionerByBarNumberInteractor = async (
  _applicationContext: ServerApplicationContext,
  { barNumber }: { barNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<
  | RawPractitioner
  | Partial<RawPractitioner & { contact: { state: string } }>[]
  | undefined
> => {
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
          {
            admissionsDate: practitioner.admissionsDate,
            admissionsStatus: practitioner.admissionsStatus,
            barNumber: practitioner.barNumber,
            contact: {
              state: practitioner.originalBarState,
            },
            name: practitioner.name,
            practiceType: practitioner.practiceType,
            practitionerType: practitioner.practitionerType,
            originalBarState: practitioner.originalBarState,
          },
        ]
      : []; // return empty array for public user if no practitioner found
};
