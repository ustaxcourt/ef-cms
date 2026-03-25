import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const uploadOrderDocumentInteractor = async (
  applicationContext: ClientApplicationContext,
  {
    documentFile,
    fileIdToOverwrite,
  }: { fileIdToOverwrite?: string; documentFile: any },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderDocumentStorageId = await applicationContext
    .getPersistenceGateway()
    .uploadDocumentFromClient({
      applicationContext,
      document: documentFile,
      key: fileIdToOverwrite,
    });

  return orderDocumentStorageId;
};
