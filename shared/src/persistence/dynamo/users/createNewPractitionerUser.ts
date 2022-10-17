import * as client from '../../dynamodbClientService';

export const updateUserRecords = async ({
  applicationContext,
  updatedUser,
  userId,
}: {
  applicationContext: IApplicationContext;
  updatedUser: any;
  userId: String;
}) => {
  await client.put({
    Item: {
      ...updatedUser,
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  await client.put({
    Item: {
      pk: `${updatedUser.role}|${updatedUser.name.toUpperCase()}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });

  await client.put({
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
  user: TUser;
}) => {
  const { userId } = user;

  await applicationContext
    .getCognito()
    .adminCreateUser({
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
    })
    .promise();

  const updatedUser = await exports.updateUserRecords({
    applicationContext,
    updatedUser: user,
    userId,
  });

  return updatedUser;
};
