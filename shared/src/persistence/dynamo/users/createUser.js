const AWS = require('aws-sdk');
const client = require('../../dynamodbClientService');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { User } = require('../../../business/entities/User');

exports.createUserRecords = async ({ applicationContext, user, userId }) => {
  delete user.password;

  if (user.barNumber === '') {
    delete user.barNumber;
  }

  if (user.section) {
    await client.put({
      Item: {
        pk: `${user.section}|user`,
        sk: userId,
      },
      applicationContext,
    });

    if (user.role === User.ROLES.judge) {
      await client.put({
        Item: {
          pk: 'judge|user',
          sk: userId,
        },
        applicationContext,
      });
    }
  }

  await client.put({
    Item: {
      pk: userId,
      sk: userId,
      ...user,
      userId,
    },
    applicationContext,
  });

  if (
    (user.role === User.ROLES.practitioner ||
      user.role === User.ROLES.respondent) &&
    user.name &&
    user.barNumber
  ) {
    await createMappingRecord({
      applicationContext,
      pkId: user.name,
      skId: userId,
      type: user.role,
    });

    await createMappingRecord({
      applicationContext,
      pkId: user.barNumber,
      skId: userId,
      type: user.role,
    });
  }

  return {
    ...user,
    userId,
  };
};

exports.createUser = async ({ applicationContext, user }) => {
  const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1',
  });
  let userId;

  try {
    const response = await cognito
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
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.email,
      })
      .promise();
    userId = response.User.Username;
  } catch (err) {
    // the user already exists
    const response = await cognito
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.email,
      })
      .promise();

    await cognito
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

    userId = response.Username;
  }

  return await this.createUserRecords({
    applicationContext,
    user,
    userId,
  });
};
