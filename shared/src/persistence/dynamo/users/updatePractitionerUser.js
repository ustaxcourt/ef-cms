const client = require('../../dynamodbClientService');
const { getUserById } = require('./getUserById');

exports.updateUserRecords = async ({
  applicationContext,
  oldUser,
  updatedUser,
  userId,
}) => {
  await client.delete({
    applicationContext,
    key: {
      pk: `section|${oldUser.section}`,
      sk: `user|${userId}`,
    },
  });

  await client.put({
    Item: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      ...updatedUser,
      userId,
    },
    applicationContext,
  });

  await client.delete({
    applicationContext,
    key: {
      pk: `${oldUser.role}|${oldUser.name}`,
      sk: `user|${userId}`,
    },
  });

  await client.delete({
    applicationContext,
    key: {
      pk: `${oldUser.role}|${oldUser.barNumber}`,
      sk: `user|${userId}`,
    },
  });

  await client.put({
    Item: {
      pk: `${updatedUser.role}|${updatedUser.name}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });

  await client.put({
    Item: {
      pk: `${updatedUser.role}|${updatedUser.barNumber}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });

  return {
    ...updatedUser,
    userId,
  };
};

exports.updatePractitionerUser = async ({ applicationContext, user }) => {
  const { userId } = user;

  const oldUser = await getUserById({
    applicationContext,
    userId,
  });

  if (!oldUser.email && user.email) {
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
            Value: user.email,
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
        Username: user.email,
      })
      .promise();
  } else {
    try {
      const response = await applicationContext
        .getCognito()
        .adminGetUser({
          UserPoolId: process.env.USER_POOL_ID,
          Username: user.email,
        })
        .promise();

      if (response) {
        await applicationContext
          .getCognito()
          .adminUpdateUserAttributes({
            UserAttributes: [
              {
                Name: 'custom:role',
                Value: user.role,
              },
            ],
            UserPoolId: process.env.USER_POOL_ID,
            Username: response.Username,
          })
          .promise();
      }
    } catch (error) {
      applicationContext.logger.error(error);
    }
  }

  return await exports.updateUserRecords({
    applicationContext,
    oldUser,
    updatedUser: user,
    userId,
  });
};
