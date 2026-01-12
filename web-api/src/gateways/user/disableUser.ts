import { environment } from '@web-api/environment';
import { getCognito } from '@web-api/persistence/cognito/getCognito';

export async function disableUser({ email }: { email: string }): Promise<void> {
  await getCognito().adminDisableUser({
    UserPoolId: environment.userPoolId,
    Username: email.toLowerCase(),
  });
}
