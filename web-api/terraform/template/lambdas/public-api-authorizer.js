const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const ddbClient = new DynamoDBClient({ region: 'us-east-1' });

const marshallOptions = {
  convertClassInstanceToMap: false,
  convertEmptyValues: false,
  removeUndefinedValues: true,
};

const unmarshallOptions = {
  wrapNumbers: false,
};

const docClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions,
  unmarshallOptions,
});

const getWhiteListIps = async () => {
  const { Item: whiteListIps } = await docClient.send(
    new GetItemCommand({
      Key: {
        pk: 'allowed-terminal-ips',
        sk: 'allowed-terminal-ips',
      },
      TableName: `efcms-deploy-${process.env.STAGE}`,
    }),
  );
  return whiteListIps?.ips ?? [];
};

const createAuthorizer = ({ getWhiteListIpsFunction }) => {
  return async event => {
    const ips = await getWhiteListIpsFunction();

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
      principalId: event.requestContext.identity.sourceIp,
    };

    return policy;
  };
};

exports.handler = createAuthorizer({
  getWhiteListIpsFunction: getWhiteListIps,
});
exports.createAuthorizer = createAuthorizer;
