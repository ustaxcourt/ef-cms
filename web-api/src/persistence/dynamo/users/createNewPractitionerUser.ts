import {
  AdminCreateUserCommandInput,
  CognitoIdentityProvider,
} from '@aws-sdk/client-cognito-identity-provider';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { put } from '../../dynamodbClientService';

export const updateUserRecords = async ({
  applicationContext,
  updatedUser,
  userId,
}: {
  applicationContext: IApplicationContext;
  updatedUser: any;
  userId: string;
}) => {
  await put({
    Item: {
      ...updatedUser,
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  await put({
    Item: {
      pk: `${updatedUser.role}|${updatedUser.name.toUpperCase()}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });

  await put({
    Item: {
      pk: `${updatedUser.role}|${updatedUser.barNumber.toUpperCase()}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });

  return {
    ...updatedUser,
    userId,
  };
};

export const createNewPractitionerUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawPractitioner;
}) => {
  const { userId } = user;

  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  const params: AdminCreateUserCommandInput = {
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      {
        Name: 'email_verified',
        Value: 'True',
      },
      {
        Name: 'email',
        Value: user.pendingEmail,
      },
      {
        Name: 'custom:role',
        Value: user.role,
      },
      {
        Name: 'name',
        Value: user.name,
      },
      {
        Name: 'custom:userId',
        Value: user.userId,
      },
    ],
    UserPoolId: process.env.USER_POOL_ID,
    Username: user.pendingEmail,
  };

  if (process.env.STAGE !== 'prod') {
    params.TemporaryPassword = process.env.DEFAULT_ACCOUNT_PASS;
  }

  await cognito.adminCreateUser(params);

  const updatedUser = await updateUserRecords({
    applicationContext,
    updatedUser: user,
    userId,
  });

  return updatedUser;
};
