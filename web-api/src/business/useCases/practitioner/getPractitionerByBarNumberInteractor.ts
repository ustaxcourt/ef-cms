import { Practitioner } from '../../../../../shared/src/business/entities/Practitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * getPractitionerByBarNumberInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.barNumber the bar number for the practitioner to get
 * @returns {Practitioner} the retrieved practitioner
 */
export const getPractitionerByBarNumberInteractor = async (
  applicationContext: ServerApplicationContext,
  { barNumber }: { barNumber: string },
) => {
  const requestUser = applicationContext.getCurrentUser();
  const isLoggedInUser = !!requestUser;

  if (
    isLoggedInUser &&
    !isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)
  ) {
    throw new UnauthorizedError('Unauthorized for getting attorney user');
  }
  const foundPractitioner = await applicationContext
    .getPersistenceGateway()
    .getPractitionerByBarNumber({ applicationContext, barNumber });

  let practitioner;

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
          },
        ]
      : [];
};
