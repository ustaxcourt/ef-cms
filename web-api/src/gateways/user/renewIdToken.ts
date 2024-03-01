import { AuthFlowType } from '@aws-sdk/client-cognito-identity-provider';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function renewIdToken(
  applicationContext: ServerApplicationContext,
  { refreshToken }: { refreshToken: string },
): Promise<string> {
  const result = await applicationContext.getCognito().initiateAuth({
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
    ClientId: applicationContext.environment.cognitoClientId,
  });

  if (!result.AuthenticationResult?.IdToken) {
    throw new Error('Id token not present on initiateAuth response');
  }

  return result.AuthenticationResult.IdToken;
}
