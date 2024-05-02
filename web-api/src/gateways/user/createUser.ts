import {
  AdminCreateUserCommandInput,
  AttributeType,
  DeliveryMediumType,
  MessageActionType,
} from '@aws-sdk/client-cognito-identity-provider';
import { Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function createUser(
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
  const formattedAttributes: AttributeType[] = [
    {
      Name: 'custom:userId',
      Value: userId,
    },
    {
      Name: 'custom:role',
      Value: role,
    },
    {
      Name: 'name',
      Value: name,
    },
    {
      Name: 'email',
      Value: email.toLowerCase(),
    },
    {
      Name: 'email_verified',
      Value: 'true',
    },
  ];

  let tempPass: string | undefined;
  if (temporaryPassword) {
    tempPass = temporaryPassword;
  } else if (applicationContext.environment.stage !== 'prod') {
    tempPass = applicationContext.environment.defaultAccountPass;
  } else {
    tempPass = undefined; // sets a random temporary password
  }

  const createUserArgs: AdminCreateUserCommandInput = {
    DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
    MessageAction: sendWelcomeEmail ? undefined : MessageActionType.SUPPRESS,
    TemporaryPassword: tempPass,
    UserAttributes: formattedAttributes,
    UserPoolId: poolId ?? applicationContext.environment.userPoolId,
    Username: email.toLowerCase(),
  };

  await applicationContext.getCognito().adminCreateUser(createUserArgs);
}
