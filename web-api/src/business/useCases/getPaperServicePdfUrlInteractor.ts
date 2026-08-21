import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const getPaperServicePdfUrlInteractor = async (
  applicationContext: ServerApplicationContext,
  { fileId }: { fileId: string },
  authorizedUser: UnknownAuthUser,
): Promise<{ url: string }> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key: `paper-service-pdf/${fileId}`,
  });
};
