import { ServerApplicationContext } from '@web-api/applicationContext';

export const logInInteractor = async (
  applicationContext: ServerApplicationContext,
  { email, password }: { email: string; password: string },
): Promise<{ idToken: string; accessToken: string; refreshToken: string }> => {
  const cognito = applicationContext.getCognito();

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
};
