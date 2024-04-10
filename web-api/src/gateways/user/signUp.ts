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
  const lowerCaseEmail = email.toLowerCase();

  await applicationContext.getCognito().signUp({
    ClientId: applicationContext.environment.cognitoClientId,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: lowerCaseEmail,
      },
      {
        Name: 'name',
        Value: name,
      },
      {
        Name: 'custom:userId',
        Value: userId,
      },
      {
        Name: 'custom:role',
        Value: role,
      },
    ],
    Username: lowerCaseEmail,
  });

  return { userId };
}
