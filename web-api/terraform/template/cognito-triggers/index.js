const AWS = require('aws-sdk');

const { DynamoDB } = AWS;

const dynamoClient = new DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

exports.handler = async event => {
  const { email, name, sub: userId } = event.request.userAttributes;

  await dynamoClient
    .put({
      Item: {
        email,
        name,
        pk: userId,
        role: 'petitioner',
        sk: userId,
        userId,
      },
      TableName: process.env.DYNAMO_TABLE,
    })
    .promise();

  return event;
};
