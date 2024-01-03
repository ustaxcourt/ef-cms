import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownUserError } from '@web-api/errors/errors';

export const loginInteractor = async (
  applicationContext: ServerApplicationContext,
  { email, password }: { email: string; password: string },
): Promise<{ idToken: string; accessToken: string; refreshToken: string }> => {
  try {
    const result = await applicationContext.getCognito().initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        PASSWORD: password,
        USERNAME: email,
      },
      ClientId: applicationContext.environment.cognitoClientId,
    });

    return {
      accessToken: result.AuthenticationResult!.AccessToken!,
      idToken: result.AuthenticationResult!.IdToken!,
      refreshToken: result.AuthenticationResult!.RefreshToken!,
    };
  } catch (err: any) {
    if (
      err.name === 'InvalidPasswordException' ||
      err.name === 'NotAuthorizedException'
    ) {
      throw new UnknownUserError('Invalid Username or Password');
    }

    throw err;
  }
};
