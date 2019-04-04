const AWS = require('aws-sdk');
const client = require('../../dynamodbClientService');
const { getSectionForRole } = require('../../../business/entities/WorkQueue');

exports.createUser = async ({ user, applicationContext }) => {
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
        Username: user.email,
        UserPoolId: process.env.USER_POOL_ID,
      })
      .promise();
    userId = response.User.Username;
  } catch (err) {
    const response = await cognito
      .adminGetUser({
        Username: user.email,
        UserPoolId: process.env.USER_POOL_ID,
      })
      .promise();
    userId = response.Username;
  }

  await client.put({
    applicationContext,
    Item: {
      pk: `${getSectionForRole(user.role)}|user`,
      sk: userId,
    },
  });

  await client.put({
    applicationContext,
    Item: {
      pk: userId,
      sk: userId,
      ...user,
      userId,
    },
  });

  return {
    ...user,
    userId,
  };
};
