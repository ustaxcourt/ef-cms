import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';

export const checkEmailAvailabilityInteractor = async (
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<{ isAccountUnverified: boolean; isEmailAvailable: boolean }> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const user = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email,
    });

  const isAccountUnverified =
    user?.accountStatus === UserStatusType.UNCONFIRMED;

  return { isAccountUnverified, isEmailAvailable: !user };
};
