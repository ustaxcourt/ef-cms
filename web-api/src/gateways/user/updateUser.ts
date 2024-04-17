import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import { Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

interface UserAttributes {
  role?: Role;
  email?: string;
}

export async function updateUser(
  applicationContext: ServerApplicationContext,
  {
    attributesToUpdate,
    email,
    poolId,
  }: { email: string; attributesToUpdate: UserAttributes; poolId?: string },
): Promise<void> {
  const formattedAttributesToUpdate: AttributeType[] = [];

  if (attributesToUpdate.role) {
    formattedAttributesToUpdate.push({
      Name: 'custom:role',
      Value: attributesToUpdate.role,
    });
  }

  if (attributesToUpdate.email) {
    formattedAttributesToUpdate.push({
      Name: 'email',
      Value: attributesToUpdate.email.toLowerCase(),
    });
    formattedAttributesToUpdate.push({
      Name: 'email_verified',
      Value: 'true',
    });
  }

  await applicationContext.getCognito().adminUpdateUserAttributes({
    UserAttributes: formattedAttributesToUpdate,
    UserPoolId: poolId ?? applicationContext.environment.userPoolId,
    Username: email.toLowerCase(),
  });
}
