import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const uploadDocumentInteractor = async (
  applicationContext: ClientApplicationContext,
  { documentFile, key, onUploadProgress },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !(
      isAuthorized(authorizedUser, ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT) ||
      isAuthorized(authorizedUser, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT) ||
      isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext
    .getPersistenceGateway()
    .uploadDocumentFromClient({
      applicationContext,
      document: documentFile,
      key,
      onUploadProgress,
    });
};
