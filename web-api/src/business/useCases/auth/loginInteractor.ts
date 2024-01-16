import {
  NotFoundError,
  UnauthorizedError,
  UnidentifiedUserError,
} from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';

export type LoginInteractorResponse = {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  challengeName?: string;
  session?: string;
};

export const loginInteractor = async (
  applicationContext: ServerApplicationContext,
  { email, password }: { email: string; password: string },
): Promise<LoginInteractorResponse> => {
  try {
    const result = await applicationContext.getCognito().initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        PASSWORD: password,
        USERNAME: email,
      },
      ClientId: applicationContext.environment.cognitoClientId,
    });

    if (result?.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      return {
        challengeName: 'NEW_PASSWORD_REQUIRED',
        session: result.Session!,
      };
    }

    return {
      accessToken: result.AuthenticationResult!.AccessToken!,
      idToken: result.AuthenticationResult!.IdToken!,
      refreshToken: result.AuthenticationResult!.RefreshToken!,
    };
  } catch (err: any) {
    if (
      err.name === 'InvalidPasswordException' ||
      err.name === 'NotAuthorizedException' ||
      err.name === 'UserNotFoundException'
    ) {
      throw new UnidentifiedUserError('Invalid Username or Password'); //401
    }

    if (err.name === 'UserNotConfirmedException') {
      await resendAccountConfirmation(applicationContext, email);

      throw new UnauthorizedError('User is unconfirmed'); //403
    }

    throw err;
  }
};

async function resendAccountConfirmation(
  applicationContext: ServerApplicationContext,
  email: string,
): Promise<void> {
  const cognito = applicationContext.getCognito();

  const users = await cognito.listUsers({
    AttributesToGet: ['custom:userId'],
    Filter: `email = "${email}"`,
    UserPoolId: process.env.USER_POOL_ID,
  });

  const userId = users.Users?.[0].Attributes?.find(
    element => element.Name === 'custom:userId',
  )?.Value;

  if (!userId) {
    throw new NotFoundError(
      `Could not find user to re-send confirmation code to. ${email}`,
    );
  }

  await applicationContext
    .getUseCaseHelpers()
    .createUserConfirmation(applicationContext, {
      email,
      userId,
    });
}
