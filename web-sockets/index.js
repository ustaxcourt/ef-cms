const AWS = require('aws-sdk');
const { DynamoDB } = AWS;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'max-age=0, private, no-cache, no-store, must-revalidate',
  'Content-Type': 'application/json',
  Pragma: 'no-cache',
  'X-Content-Type-Options': 'nosniff',
};

exports.defaultMessage = (event, context, callback) => {
  callback(null);
};

exports.zip = async event => {
  console.log('event', event);

  const apig = new AWS.ApiGatewayManagementApi({
    endpoint: 'ws-efcms-dev.ustc-case-mgmt.flexion.us', // todo: this would come from ENV
  });

  const dbClient = new DynamoDB.DocumentClient({
    region: 'us-east-1',
  });

  const results = await dbClient
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': 'connections',
      },
      Key: {
        pk: 'connections',
      },
      KeyConditionExpression: '#pk = :pk',
      TableName: 'cseibert-testing',
    })
    .promise();

  const connections = results.Items;

  for (const connection of connections) {
    console.log('connection', connection);
    try {
      await apig
        .postToConnection({
          ConnectionId: connection.sk,
          Data: 'hello world',
        })
        .promise();
    } catch (err) {
      console.log('err', err);

      if (err.statusCode === 410) {
        await dbClient
          .delete({
            Key: {
              pk: 'connections',
              sk: connection.sk,
            },
            TableName: 'cseibert-testing',
          })
          .promise();
      }
    }
  }

  return {
    body: JSON.stringify({
      yo: 'lo',
    }),
    headers,
    statusCode: 200,
  };
};

exports.connect = async event => {
  const dbClient = new DynamoDB.DocumentClient({
    region: 'us-east-1',
  });

  await dbClient
    .put({
      Item: {
        pk: 'connections',
        sk: event.requestContext.connectionId,
      },
      TableName: 'cseibert-testing',
    })
    .promise();

  return {
    body: JSON.stringify({
      yo: 'lo',
    }),
    headers,
    statusCode: 200,
  };
};

exports.disconnect = async event => {
  const dbClient = new DynamoDB.DocumentClient({
    region: 'us-east-1',
  });

  await dbClient
    .delete({
      Key: {
        pk: 'connections',
        sk: event.requestContext.connectionId,
      },
      TableName: 'cseibert-testing',
    })
    .promise();

  return {
    body: JSON.stringify({
      yo: 'lo',
    }),
    headers,
    statusCode: 200,
  };
};
