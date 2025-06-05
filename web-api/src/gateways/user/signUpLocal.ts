import { Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function signUpLocal(
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
  const userId = await applicationContext
    .getUserGateway()
    .signUp(applicationContext, {
      email,
      name,
      password,
      role,
    });

  // Locally we must set the custom:name attribute for cognito-local
  await applicationContext.getCognito().adminUpdateUserAttributes({
    UserAttributes: [
      {
        Name: 'custom:name',
        Value: name,
      },
    ],
    UserPoolId: applicationContext.environment.userPoolId,
    Username: email.toLowerCase(),
  });

  return userId;
}
