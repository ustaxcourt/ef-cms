import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../../web-api/src/errors/errors';

export const getPaperServicePdfUrlInteractor = async (
  applicationContext: IApplicationContext,
  { fileId }: { fileId: string },
): Promise<{ url: string }> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key: `paper-service-pdf/${fileId}`,
  });
};
