import { ServerApplicationContext } from '@web-api/applicationContext';

export async function disableUser(
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<void> {
  await applicationContext.getCognito().adminDisableUser({
    UserPoolId: applicationContext.environment.userPoolId,
    Username: email.toLowerCase(),
  });
}
