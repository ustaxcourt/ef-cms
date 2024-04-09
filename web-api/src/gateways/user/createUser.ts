import {
  AdminCreateUserCommandInput,
  AttributeType,
  DeliveryMediumType,
  MessageActionType,
} from '@aws-sdk/client-cognito-identity-provider';
import { Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

interface UserAttributes {
  role?: Role;
  email?: string;
  name?: string;
  userId?: string;
}

export async function createUser(
  applicationContext: ServerApplicationContext,
  {
    attributesToUpdate,
    email,
    poolId,
    resendInvitationEmail = false,
  }: {
    email: string;
    poolId?: string;
    attributesToUpdate: UserAttributes;
    resendInvitationEmail?: boolean;
  },
): Promise<void> {
  const formattedAttributesToUpdate: AttributeType[] = [];
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

  if (attributesToUpdate.userId) {
    formattedAttributesToUpdate.push({
      Name: 'custom:userId',
      Value: attributesToUpdate.userId,
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

  const messageAction = resendInvitationEmail
    ? MessageActionType.RESEND
    : undefined;

  const createUserArgs: AdminCreateUserCommandInput = {
    DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
    MessageAction: messageAction,
    UserAttributes: formattedAttributesToUpdate,
    UserPoolId: poolId ?? applicationContext.environment.userPoolId,
    Username: email.toLowerCase(),
  };

  if (process.env.STAGE !== 'prod') {
    createUserArgs.TemporaryPassword = process.env.DEFAULT_ACCOUNT_PASS;
  }

  await applicationContext.getCognito().adminCreateUser(createUserArgs);
}
