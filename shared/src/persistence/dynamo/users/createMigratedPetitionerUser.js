const client = require('../../dynamodbClientService');

const createUserRecords = async ({ applicationContext, user, userId }) => {
  delete user.password;

  await client.put({
    Item: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      ...user,
      userId,
    },
    applicationContext,
  });

  const formattedEmail = user.email.toLowerCase().trim();
  await client.put({
    Item: {
      pk: `user-email|${formattedEmail}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  return {
    ...user,
    userId,
  };
};

exports.createUserRecords = createUserRecords;

exports.createMigratedPetitionerUser = async ({ applicationContext, user }) => {
  try {
    const response = await applicationContext
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
        ],
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.email,
      })
      .promise();

    return await createUserRecords({
      applicationContext,
      user,
      userId: response.User.Username,
    });
  } catch (err) {
    applicationContext.logger.error(err);
  }
};
