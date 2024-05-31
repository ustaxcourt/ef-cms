import {
  AuthFlowType,
  ChallengeNameType,
} from '@aws-sdk/client-cognito-identity-provider';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function initiateAuth(
  applicationContext: ServerApplicationContext,
  { email, password }: { email: string; password: string },
): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
}> {
  const result = await applicationContext.getCognito().initiateAuth({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      PASSWORD: password,
      USERNAME: email.toLowerCase(),
    },
    ClientId: applicationContext.environment.cognitoClientId,
  });

  // 10368 OPTION 3
  // let isDeploying = await applicationContext
  //   .getPersistenceGateway()
  //   .getConfigurationItemValue({
  //     applicationContext,
  //     configurationItemKey: 'pending-color-switch',
  //   });

  // console.log('isDeploying', isDeploying);

  // if (isDeploying) throw new Error('PassiveColorLogin');

  if (result.ChallengeName) {
    if (result.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
      const PasswordChangeError = new Error('NewPasswordRequired');
      PasswordChangeError.name = 'NewPasswordRequired';
      throw PasswordChangeError;
    }
  }

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
  };
}
