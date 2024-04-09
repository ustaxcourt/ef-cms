import { ServerApplicationContext } from '@web-api/applicationContext';

export async function changePassword(
  applicationContext: ServerApplicationContext,
  {
    code,
    email,
    newPassword,
  }: { code: string; newPassword: string; email: string },
): Promise<void> {
  await applicationContext.getCognito().confirmForgotPassword({
    ClientId: applicationContext.environment.cognitoClientId,
    ConfirmationCode: code,
    Password: newPassword,
    Username: email.toLowerCase(),
  });
}
