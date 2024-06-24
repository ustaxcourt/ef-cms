import { PractitionerDocument } from '../../../../../shared/src/business/entities/PractitionerDocument';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * getPractitionerDocumentsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
export const getPractitionerDocumentsInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    barNumber,
  }: {
    barNumber: string;
  },
) => {
  const requestUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(requestUser, ROLE_PERMISSIONS.UPLOAD_PRACTITIONER_DOCUMENT)
  ) {
    throw new UnauthorizedError(
      'Unauthorized for getting practitioner documents',
    );
  }

  const practitionerDocuments = await applicationContext
    .getPersistenceGateway()
    .getPractitionerDocuments({
      applicationContext,
      barNumber,
    });

  return PractitionerDocument.validateRawCollection(practitionerDocuments, {
    applicationContext,
  });
};
