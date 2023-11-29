import { Practitioner } from '../../entities/Practitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
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
  applicationContext: IApplicationContext,
  { barNumber }: { barNumber: string },
) => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)) {
    throw new UnauthorizedError('Unauthorized for getting attorney user');
  }

  const foundPractitioner = await applicationContext
    .getPersistenceGateway()
    .getPractitionerByBarNumber({ applicationContext, barNumber });

  let practitioner;

  if (foundPractitioner) {
    practitioner = new Practitioner(foundPractitioner).validate().toRawObject();
  }

  return practitioner;
};
