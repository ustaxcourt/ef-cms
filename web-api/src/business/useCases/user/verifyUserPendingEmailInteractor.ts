import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '../../../errors/errors';
import { updateUserEmailAddress } from '@web-api/business/useCases/auth/changePasswordInteractor';

export const verifyUserPendingEmailInteractor = async (
  applicationContext: ServerApplicationContext,
  { token }: { token: string },
): Promise<void> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  if (
    !user.pendingEmailVerificationToken ||
    user.pendingEmailVerificationToken !== token
  ) {
    throw new UnauthorizedError('Tokens do not match');
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: user.pendingEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  // Todo 10007 Look for other places we are doing this. Can this be consolidated?
  const { updatedUser } = await updateUserEmailAddress(applicationContext, {
    user,
  });

  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  await cognito.adminUpdateUserAttributes({
    UserAttributes: [
      {
        Name: 'email',
        Value: updatedUser.email,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
    UserPoolId: process.env.USER_POOL_ID,
    Username: user.email,
  });

  await applicationContext.getWorkerGateway().initialize(applicationContext, {
    message: {
      payload: { user: updatedUser },
      type: MESSAGE_TYPES.QUEUE_UPDATE_ASSOCIATED_CASES,
      user: applicationContext.getCurrentUser(),
    },
  });
};
