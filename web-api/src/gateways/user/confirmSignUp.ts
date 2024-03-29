import { ServerApplicationContext } from '@web-api/applicationContext';

export async function confirmSignUp(
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<void> {
  await applicationContext.getCognito().adminConfirmSignUp({
    UserPoolId: applicationContext.environment.userPoolId,
    Username: email.toLocaleLowerCase(),
  });
}
