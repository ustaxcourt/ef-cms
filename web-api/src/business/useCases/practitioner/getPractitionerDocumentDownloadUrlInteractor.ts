import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getPractitionerDocumentByFileId } from '@web-api/persistence/postgres/practitionerDocuments/getPractitionerDocumentByFileId';

export type PractitionerDocumentDownloadUrl = { url: string };

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
): Promise<PractitionerDocumentDownloadUrl> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPLOAD_PRACTITIONER_DOCUMENT)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const practitionerDocument = await getPractitionerDocumentByFileId({
    barNumber,
    fileId: practitionerDocumentFileId,
  });

  return await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    filename: practitionerDocument?.fileName,
    key: practitionerDocumentFileId,
  });
};
