import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * deletePractitionerDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the delete call
 */
export const deletePractitionerDocumentInteractor = async (
  applicationContext: IApplicationContext,
  {
    barNumber,
    practitionerDocumentFileId,
  }: {
    barNumber: string;
    practitionerDocumentFileId: string;
  },
) => {
  const requestUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(requestUser, ROLE_PERMISSIONS.UPLOAD_PRACTITIONER_DOCUMENT)
  ) {
    throw new UnauthorizedError(
      'Unauthorized for deleting practitioner documents',
    );
  }

  await applicationContext.getPersistenceGateway().deleteDocumentFile({
    applicationContext,
    key: practitionerDocumentFileId,
  });

  return await applicationContext
    .getPersistenceGateway()
    .deletePractitionerDocument({
      applicationContext,
      barNumber,
      practitionerDocumentFileId,
    });
};
