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

const sqs = new AWS.SQS({ region: 'us-east-1' });

const scanTableSegment = async (segment, totalSegments, timestamp) => {
  let hasMoreResults = true;
  let lastKey = null;
  while (hasMoreResults) {
    hasMoreResults = false;

    await documentClient
      .scan({
        ExclusiveStartKey: lastKey,
        Segment: segment,
        TableName: `efcms-${process.env.ENVIRONMENT}`,
        TotalSegments: totalSegments,
      })
      .promise()
      .then(async results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;
        for (let item of results.Items) {
          try {
            // eslint-disable-next-line promise/no-nesting
            await documentClient
              .put({
                Item: {
                  ...item,
                  migrate: timestamp,
                },
                TableName: `efcms-${process.env.ENVIRONMENT}`,
              })
              .promise();
            // eslint-disable-next-line promise/no-nesting
            await documentClient
              .update({
                ExpressionAttributeNames: {
                  '#a': 'ingest',
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
          } catch (e) {
            console.log('error processing segment items', e);
          }
        }
      });
  }
};

exports.handler = async event => {
  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { segment, timestamp, totalSegments } = JSON.parse(body);

  console.log(`about to process ${segment} of ${totalSegments}`);

  await scanTableSegment(segment, totalSegments, timestamp);
  await sqs
    .deleteMessage({
      QueueUrl: process.env.SEGMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
