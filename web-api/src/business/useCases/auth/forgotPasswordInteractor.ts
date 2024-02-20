import {
  AdminCreateUserCommandInput,
  CognitoIdentityProvider,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const forgotPasswordInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    email,
  }: {
    email: string;
  },
): Promise<void> => {
  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  const user = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, { email });

  if (!user) {
    return;
  }

  if (user.accountStatus === UserStatusType.UNCONFIRMED) {
    await applicationContext
      .getUseCaseHelpers()
      .createUserConfirmation(applicationContext, {
        email,
        userId: user.userId,
      });

    throw new UnauthorizedError('User is unconfirmed'); //403
  }

  if (user.accountStatus === UserStatusType.FORCE_CHANGE_PASSWORD) {
    const input: AdminCreateUserCommandInput = {
      DesiredDeliveryMediums: ['EMAIL'],
      MessageAction: 'RESEND',
      UserPoolId: applicationContext.environment.userPoolId,
      Username: email,
    };

    if (process.env.STAGE !== 'prod') {
      input.TemporaryPassword = process.env.DEFAULT_ACCOUNT_PASS;
    }

    await cognito.adminCreateUser(input);
    throw new UnauthorizedError('User is unconfirmed'); //403
  }

  await cognito.forgotPassword({
    ClientId: applicationContext.environment.cognitoClientId,
    Username: email,
  });
};
