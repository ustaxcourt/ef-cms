import { AuthFlowType } from '@aws-sdk/client-cognito-identity-provider';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function initiateAuth(
  applicationContext: ServerApplicationContext,
  { email, password }: { email: string; password: string },
): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
  session: string | undefined;
}> {
  const result = await applicationContext.getCognito().initiateAuth({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      PASSWORD: password,
      USERNAME: email,
    },
    ClientId: applicationContext.environment.cognitoClientId,
  });

  if (
    !result.AuthenticationResult?.AccessToken ||
    !result.AuthenticationResult?.IdToken ||
    !result.AuthenticationResult?.RefreshToken
  ) {
    const InitiateAuthError = new Error('InitiateAuthError');
    InitiateAuthError.name = 'InitiateAuthError';
    throw InitiateAuthError;
  }

  return {
    accessToken: result.AuthenticationResult.AccessToken,
    idToken: result.AuthenticationResult.IdToken,
    refreshToken: result.AuthenticationResult.RefreshToken,
    session: result.Session,
  };
}
