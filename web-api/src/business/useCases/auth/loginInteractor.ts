import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownUserError } from '@web-api/errors/errors';

export const loginInteractor = async (
  applicationContext: ServerApplicationContext,
  { email, password }: { email: string; password: string },
): Promise<{ idToken: string; accessToken: string; refreshToken: string }> => {
  const cognito = applicationContext.getCognito();

  try {
    const result = await cognito
      .initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          PASSWORD: password,
          USERNAME: email,
        },
        ClientId: applicationContext.environment.cognitoClientId,
      })
      .promise(); // TODO 10007: Update cognito to v3

    return {
      accessToken: result.AuthenticationResult!.AccessToken!,
      idToken: result.AuthenticationResult!.IdToken!,
      refreshToken: result.AuthenticationResult!.RefreshToken!,
    };
  } catch (err: any) {
    // AWS Cognito InvalidPasswordException
    if (err.code === 'InvalidPasswordException') {
      throw new UnknownUserError('Invalid Username or Password');
    }
    throw err;
  }
};
