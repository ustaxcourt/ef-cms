const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

const getWhiteListIps = async () => {
  const { Item: whiteListIps } = await docClient
    .get({
      Key: {
        pk: 'allowed-terminal-ips',
        sk: 'allowed-terminal-ips',
      },
      TableName: `efcms-deploy-${process.env.STAGE}`,
    })
    .promise();
  return whiteListIps?.ips ?? [];
};

exports.handler = async event => {
  const ips = await getWhiteListIps();

  const policy = {
    context: {
      isTerminalUser: ips.includes(event.requestContext.identity.sourceIp),
    },
    policyDocument: {
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn.split('/').slice(0, 2).join('/') + '/*',
        },
      ],
      Version: '2012-10-17',
    },
  };

  return policy;
};
