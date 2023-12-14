import { ServerApplicationContext } from '@web-api/applicationContext';

// eslint-disable-next-line no-shadow
export const refreshToken = async (
  applicationContext: ServerApplicationContext,
  { rToken }: { rToken: string },
) => {
  const clientId = applicationContext.environment.cognitoClientId;

  const result = await applicationContext
    .getCognito()
    .initiateAuth({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: rToken,
      },
      ClientId: clientId,
    })
    .promise();

  return {
    token: result.AuthenticationResult?.IdToken,
  };
};
