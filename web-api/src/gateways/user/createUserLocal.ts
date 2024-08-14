import { Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { createUser } from '@web-api/gateways/user/createUser';

export async function createUserLocal(
  applicationContext: ServerApplicationContext,
  {
    email,
    name,
    poolId,
    role,
    sendWelcomeEmail,
    temporaryPassword,
    userId,
  }: {
    email: string;
    role: Role;
    name: string;
    userId: string;
    poolId?: string;
    temporaryPassword?: string;
    sendWelcomeEmail: boolean;
  },
): Promise<void> {
  await createUser(applicationContext, {
    email,
    name,
    poolId,
    role,
    sendWelcomeEmail,
    temporaryPassword,
    userId,
  });

  // Locally we need to store the user name in custom:name because of cognito-local
  await applicationContext.getCognito().adminUpdateUserAttributes({
    UserAttributes: [{ Name: 'custom:name', Value: name }],
    UserPoolId: poolId ?? applicationContext.environment.userPoolId,
    Username: email.toLowerCase(),
  });
}
