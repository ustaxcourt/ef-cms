const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

exports.handler = async event => {
  const { Records } = event;
  const newItems = Records.map(item =>
    AWS.DynamoDB.Converter.unmarshall(item.dynamodb.NewImage),
  );

  for (let item of newItems) {
    // TODO - handle case if put request fails
    // TODO - investigate using batchWrite
    await documentClient
      .put({
        Item: {
          ...item,
        },
        TableName: process.env.DESTINATION_TABLE,
      })
      .promise();
  }
};
