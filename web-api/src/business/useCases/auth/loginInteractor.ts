import { AdminCreateUserCommandInput } from '@aws-sdk/client-cognito-identity-provider';
import {
  InvalidRequest,
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
    return await applicationContext
      .getUserGateway()
      .initiateAuth(applicationContext, { email, password });
  } catch (err: any) {
    if (err.name === 'InitiateAuthError') {
      throw new Error('Unsuccessful authentication');
    }

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
): Promise<void> {
  if (
    error.name === 'InvalidPasswordException' ||
    error.name === 'NotAuthorizedException' ||
    error.name === 'UserNotFoundException'
  ) {
    if (error.message?.includes('Temporary password has expired')) {
      await resendTemporaryPassword(applicationContext, { email });
      throw new UnauthorizedError('User temporary password expired'); //403
    }

    if (error.message?.includes('Password attempts exceeded')) {
      throw new Error('Password attempts exceeded');
    }

    throw new UnidentifiedUserError('Invalid Username or Password'); //401 Security Concern do not reveal if the user account does not exist or if they have an incorrect password.
  }

  if (
    error.name === 'CodeMismatchException' ||
    error.name === 'ExpiredCodeException'
  ) {
    throw new InvalidRequest('Forgot password code is expired or incorrect');
  }

  if (error.name === 'UserNotConfirmedException') {
    if (sendAccountConfirmation) {
      await resendAccountConfirmation(applicationContext, { email });
    }

    throw new UnauthorizedError('User is unconfirmed'); //403
  }
}

async function resendAccountConfirmation(
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
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

export async function resendTemporaryPassword(
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<void> {
  const input: AdminCreateUserCommandInput = {
    DesiredDeliveryMediums: ['EMAIL'],
    MessageAction: 'RESEND',
    UserPoolId: applicationContext.environment.userPoolId,
    Username: email,
  };

  if (process.env.STAGE !== 'prod') {
    input.TemporaryPassword = process.env.DEFAULT_ACCOUNT_PASS;
  }

  await applicationContext.getCognito().adminCreateUser(input);
}
