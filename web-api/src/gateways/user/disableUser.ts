import { ServerApplicationContext } from '@web-api/applicationContext';

export async function disableUser(
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<void> {
  await applicationContext.getCognito().adminDisableUser({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
  });
}
