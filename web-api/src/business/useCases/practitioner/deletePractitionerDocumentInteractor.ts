import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deletePractitionerDocument } from '@web-api/persistence/postgres/practitionerDocuments/deletePractitionerDocument';

export const deletePractitionerDocumentInteractor = async (
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
    throw new UnauthorizedError(
      'Unauthorized for deleting practitioner documents',
    );
  }

  await applicationContext.getPersistenceGateway().deleteDocumentFile({
    applicationContext,
    key: practitionerDocumentFileId,
  });

  return await deletePractitionerDocument({
    barNumber,
    practitionerDocumentFileId,
  });
};
