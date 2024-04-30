import { Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function signUp(
  applicationContext: ServerApplicationContext,
  {
    email,
    name,
    password,
    role,
  }: {
    password: string;
    email: string;
    name: string;
    role: Role;
  },
): Promise<{ userId: string }> {
  const userId = applicationContext.getUniqueId();

  await applicationContext.getCognito().signUp({
    ClientId: applicationContext.environment.cognitoClientId,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'name',
        Value: name,
      },
    ],
    Username: email,
  });

  await applicationContext.getCognito().adminUpdateUserAttributes({
    UserAttributes: [
      {
        Name: 'custom:userId',
        Value: userId,
      },
      {
        Name: 'custom:role',
        Value: role,
      },
    ],
    UserPoolId: applicationContext.environment.userPoolId,
    Username: email,
  });

  return { userId };
}
