const AWS = require('aws-sdk');
const { getSectionForRole } = require('../../../business/entities/WorkQueue');
const client = require('../../dynamodbClientService');

exports.createUser = async ({ user, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;
  await client.put({
    applicationContext,
    Item: {
      pk: `${getSectionForRole(user.role)}|user`,
      sk: user.email,
      userId: user.email,
      ...user,
    },
    TableName: TABLE,
  });

  const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1',
  });
  await cognito
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
};
