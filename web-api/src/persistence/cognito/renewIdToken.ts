import { ServerApplicationContext } from '@web-api/applicationContext';

export const renewIdToken = async (
  applicationContext: ServerApplicationContext,
  { refreshToken }: { refreshToken: string },
): Promise<{ idToken: string }> => {
  const clientId = applicationContext.environment.cognitoClientId;

  const result = await applicationContext.getCognito().initiateAuth({
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
    ClientId: clientId,
  });

  return {
    idToken: result.AuthenticationResult?.IdToken!,
  };
};
