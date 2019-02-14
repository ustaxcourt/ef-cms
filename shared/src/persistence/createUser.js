const AWS = require('aws-sdk');
const { getSectionForRole } = require('../business/entities/WorkQueue');
const client = require('../persistence/dynamodbClientService');

exports.createUser = async ({ user, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;
  await client.put({
    applicationContext,
    TableName: TABLE,
    Item: {
      pk: `${getSectionForRole(user.role)}|user`,
      sk: user.email,
    },
  });

  const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1',
  });
  await cognito
    .adminCreateUser({
      UserPoolId: process.env.USER_POOL_ID,
      Username: user.email,
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
    })
    .promise();
};
