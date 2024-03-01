import { AuthFlowType } from '@aws-sdk/client-cognito-identity-provider';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function initiateAuth(
  applicationContext: ServerApplicationContext,
  { email, password }: { email: string; password: string },
) {
  const result = await applicationContext.getCognito().initiateAuth({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      PASSWORD: password,
      USERNAME: email,
    },
    ClientId: applicationContext.environment.cognitoClientId,
  });

  return result;
}
