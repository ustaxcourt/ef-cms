import {
  AuthFlowType,
  ChallengeNameType,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  NotFoundError,
  UnauthorizedError,
  UnidentifiedUserError,
} from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const loginInteractor = async (
  applicationContext: ServerApplicationContext,
  { email, password }: { email: string; password: string },
): Promise<{ idToken: string; accessToken: string; refreshToken: string }> => {
  try {
    const result = await applicationContext.getCognito().initiateAuth({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        PASSWORD: password,
        USERNAME: email,
      },
      ClientId: applicationContext.environment.cognitoClientId,
    });

    if (result?.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
      const PasswordChangeError = new Error('NewPasswordRequired');
      PasswordChangeError.name = 'NewPasswordRequired';
      throw PasswordChangeError;
    }

    if (
      !result.AuthenticationResult?.AccessToken ||
      !result.AuthenticationResult?.IdToken ||
      !result.AuthenticationResult?.RefreshToken
    ) {
      throw new Error('Unsuccessful authentication');
    }

    return {
      accessToken: result.AuthenticationResult.AccessToken,
      idToken: result.AuthenticationResult.IdToken,
      refreshToken: result.AuthenticationResult.RefreshToken,
    };
  } catch (err: any) {
    await authErrorHandling(applicationContext, {
      email,
      error: err,
      sendAccountConfirmation: true,
    });
    throw err;
  }
};

export async function authErrorHandling(
  applicationContext: ServerApplicationContext,
  {
    email,
    error,
    sendAccountConfirmation,
  }: {
    error: any;
    email: string;
    sendAccountConfirmation: boolean;
  },
): Promise<never> {
  if (
    error.name === 'InvalidPasswordException' ||
    error.name === 'NotAuthorizedException' ||
    error.name === 'UserNotFoundException'
  ) {
    throw new UnidentifiedUserError('Invalid Username or Password'); //401
  }

  if (error.name === 'UserNotConfirmedException') {
    if (sendAccountConfirmation) {
      await resendAccountConfirmation(applicationContext, email);
    }

    throw new UnauthorizedError('User is unconfirmed'); //403
  }

  throw error;
}

async function resendAccountConfirmation(
  applicationContext: ServerApplicationContext,
  email: string,
): Promise<void> {
  const user = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, { email });

  if (!user) {
    throw new NotFoundError(
      `Could not find user to re-send confirmation code to. ${email}`,
    );
  }

  await applicationContext
    .getUseCaseHelpers()
    .createUserConfirmation(applicationContext, {
      email,
      userId: user.userId,
    });
}
