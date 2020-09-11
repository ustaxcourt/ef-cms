const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({
  maxRetries: 10,
  retryDelayOptions: { base: 300 },
});

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
  service: dynamodb,
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' });

exports.handler = async event => {
  const { Records } = event;
  const items = Records.map(item => ({
    newItem: AWS.DynamoDB.Converter.unmarshall(item.dynamodb.NewImage),
    oldItem: AWS.DynamoDB.Converter.unmarshall(item.dynamodb.OldImage),
  }));

  for (let { newItem, oldItem } of items) {
    try {
      await documentClient
        .put({
          Item: newItem,
          TableName: process.env.DESTINATION_TABLE,
        })
        .promise();

      if (newItem.migrate !== oldItem.migrate) {
        // eslint-disable-next-line promise/no-nesting
        await documentClient
          .update({
            ExpressionAttributeNames: {
              '#a': 'processed',
            },
            ExpressionAttributeValues: {
              ':x': 1,
            },
            Key: {
              pk: `migration-${process.env.ENVIRONMENT}`,
              sk: `migration-${process.env.ENVIRONMENT}`,
            },
            ReturnValues: 'UPDATED_NEW',
            TableName: `efcms-deploy-${process.env.ENVIRONMENT}`,
            UpdateExpression: 'ADD #a :x',
          })
          .promise();
      }
    } catch (e) {
      console.log('error writing to destination table ', e, newItem, oldItem);
      await sqs
        .sendMessage({
          MessageBody: JSON.stringify(newItem),
          QueueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_failure_queue_${process.env.ENVIRONMENT}`,
        })
        .promise()
        .catch(err => {
          console.log('error writing to failure queue: ', err);
        });
    }
  }
};
