import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../../web-api/src/errors/errors';

export const getPaperServicePdfUrlInteractor = async (
  applicationContext: IApplicationContext,
  { key }: { key: string },
): Promise<{ url: string }> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.REPRINT_PAPER_SERVICE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key,
    useTempBucket: true,
  });
};
