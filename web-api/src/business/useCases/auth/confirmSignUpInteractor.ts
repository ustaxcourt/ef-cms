import { ServerApplicationContext } from '@web-api/applicationContext';

export const confirmSignUpInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    confirmationCode,
    userEmail,
  }: { confirmationCode: string; userEmail: string },
) => {
  return await applicationContext.getCognito().confirmSignUp({
    ClientId: process.env.COGNITO_CLIENT_ID,
    ConfirmationCode: confirmationCode,
    Username: userEmail,
  });
};
