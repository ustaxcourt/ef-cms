import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../../web-api/src/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const getPaperServicePdfUrlInteractor = async (
  applicationContext: IApplicationContext,
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
