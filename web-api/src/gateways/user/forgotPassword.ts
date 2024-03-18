import { ServerApplicationContext } from '@web-api/applicationContext';

export async function forgotPassword(
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<void> {
  await applicationContext.getCognito().forgotPassword({
    ClientId: applicationContext.environment.cognitoClientId,
    Username: email,
  });
}
