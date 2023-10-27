import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const uploadDocumentInteractor = async (
  applicationContext,
  { documentFile, key, onUploadProgress },
) => {
  const user = applicationContext.getCurrentUser();

  if (
    !(
      isAuthorized(user, ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT) ||
      isAuthorized(user, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT) ||
      isAuthorized(user, ROLE_PERMISSIONS.DOCKET_ENTRY)
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
