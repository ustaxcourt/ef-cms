import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.practitionerDocumentFileId the key of the document
 * @returns {Array<string>} the filing type options based on user role
 */
export const getPractitionerDocumentDownloadUrlInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    barNumber,
    practitionerDocumentFileId,
  }: {
    barNumber: string;
    practitionerDocumentFileId: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPLOAD_PRACTITIONER_DOCUMENT)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const practitionerDocument = await applicationContext
    .getPersistenceGateway()
    .getPractitionerDocumentByFileId({
      applicationContext,
      barNumber,
      fileId: practitionerDocumentFileId,
    });

  const policyUrl = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      filename: practitionerDocument.fileName,
      key: practitionerDocumentFileId,
    });

  return policyUrl;
};
