import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export const resendVerificationLinkInteractor = async (
  applicationContext: IApplicationContext,
  { email }: { email: string },
) => {
  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  return await cognito.resendConfirmationCode({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
  });
};
