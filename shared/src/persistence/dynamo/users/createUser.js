const client = require('../../dynamodbClientService');
const { ROLES } = require('../../../business/entities/EntityConstants');

exports.createUserRecords = async ({ applicationContext, user, userId }) => {
  delete user.password;

  if (user.barNumber === '') {
    delete user.barNumber;
  }

  if (user.section) {
    await client.put({
      Item: {
        pk: `section|${user.section}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });

    if (user.role === ROLES.judge) {
      await client.put({
        Item: {
          pk: 'section|judge',
          sk: `user|${userId}`,
        },
        applicationContext,
      });
    }
  }

  await client.put({
    Item: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      ...user,
      userId,
    },
    applicationContext,
  });

  if (
    (user.role === ROLES.privatePractitioner ||
      user.role === ROLES.irsPractitioner) &&
    user.name &&
    user.barNumber
  ) {
    await client.put({
      Item: {
        pk: `${user.role}|${user.name}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });
    const upperCaseBarNumber = user.barNumber.toUpperCase();
    await client.put({
      Item: {
        pk: `${user.role}|${upperCaseBarNumber}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });
  }

  return {
    ...user,
    userId,
  };
};

exports.createUser = async ({ applicationContext, user }) => {
  let userId;
  let userPoolId =
    user.role === ROLES.irsSuperuser
      ? process.env.USER_POOL_IRS_ID
      : process.env.USER_POOL_ID;

  try {
    const response = await applicationContext
      .getCognito()
      .adminCreateUser({
        MessageAction: 'SUPPRESS',
        TemporaryPassword: user.password,
        UserAttributes: [
          {
            Name: 'email_verified',
            Value: 'true',
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
        UserPoolId: userPoolId,
        Username: user.email,
      })
      .promise();
    userId = response.User.Username;
  } catch (err) {
    // the user already exists
    const response = await applicationContext
      .getCognito()
      .adminGetUser({
        UserPoolId: userPoolId,
        Username: user.email,
      })
      .promise();

    await applicationContext
      .getCognito()
      .adminUpdateUserAttributes({
        UserAttributes: [
          {
            Name: 'custom:role',
            Value: user.role,
          },
        ],
        UserPoolId: userPoolId,
        Username: response.Username,
      })
      .promise();

    userId = response.Username;
  }

  return await exports.createUserRecords({
    applicationContext,
    user,
    userId,
  });
};
