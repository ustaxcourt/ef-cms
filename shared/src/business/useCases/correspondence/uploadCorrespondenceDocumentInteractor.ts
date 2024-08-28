import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const uploadCorrespondenceDocumentInteractor = async (
  applicationContext: ClientApplicationContext,
  {
    documentFile,
    keyToOverwrite,
  }: { documentFile: string; keyToOverwrite: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const correspondenceDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocumentFromClient({
      applicationContext,
      document: documentFile,
      key: keyToOverwrite,
    });

  return correspondenceDocumentId;
};
