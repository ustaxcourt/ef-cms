import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export const confirmSignUpLocalInteractor = async (
  applicationContext: IApplicationContext,
  {
    confirmationCode,
    userEmail,
  }: { confirmationCode: string; userEmail: string },
) => {
  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  return await cognito.confirmSignUp({
    ClientId: process.env.COGNITO_CLIENT_ID,
    ConfirmationCode: confirmationCode,
    Username: userEmail,
  });
};
