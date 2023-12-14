import { ServerApplicationContext } from '@web-api/applicationContext';

export const logInInteractor = async (
  applicationContext: ServerApplicationContext,
  { email, password }: { email: string; password: string },
): Promise<{ idToken: string; accessToken: string; refreshToken: string }> => {
  console.log('*** email and pasword: ', email, password);

  const cognito = applicationContext.getCognito();

  const result = await cognito
    .initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        PASSWORD: password,
        USERNAME: email,
      },
      ClientId: 'bvjrggnd3co403c0aahscinne',
    })
    .promise();

  return {
    accessToken: result.AuthenticationResult!.AccessToken!,
    idToken: result.AuthenticationResult!.IdToken!,
    refreshToken: result.AuthenticationResult!.RefreshToken!,
  };
};
