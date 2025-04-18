import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getPractitionerByBarNumber } from '@web-api/persistence/postgres/practitioners/getPractitionerByBarNumber';

/**
 * getPractitionerByBarNumberInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.barNumber the bar number for the practitioner to get
 * @returns {Practitioner} the retrieved practitioner
 */
export const getPractitionerByBarNumberInteractor = async (
  { barNumber }: { barNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  const isLoggedInUser = !!authorizedUser?.userId;

  if (
    isLoggedInUser &&
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)
  ) {
    throw new UnauthorizedError('Unauthorized for getting attorney user');
  }
  const foundPractitioner = await getPractitionerByBarNumber({ barNumber });

  let practitioner;

  if (foundPractitioner) {
    practitioner = foundPractitioner.validate().toRawObject();
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
          },
        ]
      : [];
};
