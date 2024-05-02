import {
  AdminCreateUserCommandInput,
  AttributeType,
  DeliveryMediumType,
} from '@aws-sdk/client-cognito-identity-provider';
import { Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

interface UserAttributes {
  role?: Role;
  email?: string;
  name?: string;
  userId: string;
}

export async function createUser(
  applicationContext: ServerApplicationContext,
  {
    attributesToUpdate,
    email,
    poolId,
  }: {
    email: string;
    poolId?: string;
    attributesToUpdate: UserAttributes;
  },
): Promise<void> {
  const formattedAttributesToUpdate: AttributeType[] = [
    {
      Name: 'custom:userId',
      Value: attributesToUpdate.userId,
    },
  ];

  if (attributesToUpdate.role) {
    formattedAttributesToUpdate.push({
      Name: 'custom:role',
      Value: attributesToUpdate.role,
    });
  }

  if (attributesToUpdate.name) {
    formattedAttributesToUpdate.push({
      Name: 'name',
      Value: attributesToUpdate.name,
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

  const createUserArgs: AdminCreateUserCommandInput = {
    DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
    UserAttributes: formattedAttributesToUpdate,
    UserPoolId: poolId ?? applicationContext.environment.userPoolId,
    Username: email.toLowerCase(),
  };

  if (applicationContext.environment.stage !== 'prod') {
    createUserArgs.TemporaryPassword =
      applicationContext.environment.defaultAccountPass;
  }

  await applicationContext.getCognito().adminCreateUser(createUserArgs);
}
