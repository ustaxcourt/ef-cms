const AWS = require('aws-sdk');
const promiseRetry = require('promise-retry');

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' });

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
      await sqs
        .sendMessage({
          MessageBody: JSON.stringify(item),
          QueueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_failure_queue_${process.env.ENVIRONMENT}`,
        })
        .promise()
        .catch(err => {
          console.log('error writing to failure queue: ', err);
        });
    }
  }
};
