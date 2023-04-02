import * as client from '../../dynamodbClientService';
import { ROLES } from '../../../business/entities/EntityConstants';

export const createUserRecords = async ({
  applicationContext,
  newUser,
  userId,
}: {
  applicationContext: IApplicationContext;
  newUser: RawUser;
  userId: string;
}) => {
  await client.put({
    Item: {
      ...newUser,
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  return {
    ...newUser,
    userId,
  };
};

export const createNewPetitionerUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawUser;
}) => {
  const { userId } = user;

  const baseCreateUserParams = {
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
        Value: ROLES.petitioner,
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

  const createUserParamsLocal = {
    ...baseCreateUserParams,
    DesiredDeliveryMediums: ['EMAIL'],
    Username: user.userId,
  };

  const createUserParams = process.env.USE_COGNITO_LOCAL
    ? createUserParamsLocal
    : baseCreateUserParams;

  await applicationContext
    .getCognito()
    .adminCreateUser(createUserParams)
    .promise();

  const newUser = await createUserRecords({
    applicationContext,
    newUser: user,
    userId,
  });

  return newUser;
};
