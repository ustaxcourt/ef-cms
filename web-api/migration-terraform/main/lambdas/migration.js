const AWS = require('aws-sdk');
const promiseRetry = require('promise-retry');

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
    try {
      await promiseRetry(function (retry) {
        return documentClient
          .put({
            Item: item,
            TableName: process.env.DESTINATION_TABLE,
          })
          .promise()
          .catch(retry);
      });
    } catch (e) {
      console.log('error writing to migration destination table: ', e);
    }
  }
};
