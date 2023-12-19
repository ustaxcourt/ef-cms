import { ServerApplicationContext } from '@web-api/applicationContext';

export const renewIdToken = async (
  applicationContext: ServerApplicationContext,
  { refreshToken }: { refreshToken: string },
): Promise<{ token: string }> => {
  const clientId = applicationContext.environment.cognitoClientId;

  const result = await applicationContext
    .getCognito()
    .initiateAuth({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
      ClientId: clientId,
    })
    .promise();

  return {
    token: result.AuthenticationResult?.IdToken!,
  };
};
