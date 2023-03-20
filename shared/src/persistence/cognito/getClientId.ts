const AWS = require('aws-sdk');

exports.getClientId = async ({ userPoolId }) => {
  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider(
    { region: 'us-east-1' },
  );

  const { UserPoolClients } = await cognitoIdentityServiceProvider
    .listUserPoolClients({
      MaxResults: 1,
      UserPoolId: userPoolId,
    })
    .promise();

  return UserPoolClients[0].ClientId;
};
