import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

export const uploadCorrespondenceDocumentInteractor = async (
  applicationContext: IApplicationContext,
  {
    documentFile,
    keyToOverwrite,
  }: { documentFile: string; keyToOverwrite: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
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
