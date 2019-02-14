// const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
// const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const { getSectionForRole } = require('../business/entities/WorkQueue');

global.fetch = require('node-fetch');
const client = require('../persistence/dynamodbClientService');

exports.createUser = async ({ user, applicationContext }) => {
  const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1',
  });
  await cognito
    .adminCreateUser({
      UserPoolId: process.env.USER_POOL_ID || 'us-east-1_7uRkF0Axn',
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

  const TABLE = `efcms-${applicationContext.environment.stage}`;

  await client.put({
    applicationContext,
    TableName: TABLE,
    Item: {
      pk: `${getSectionForRole(user.role)}|user`,
      sk: user.email,
    },
  });
};
