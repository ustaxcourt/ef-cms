const AWS = require('aws-sdk');
const { chunk, isEmpty } = require('lodash');
const CHUNK_SIZE = 25;

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});
const sqs = new AWS.SQS({ region: 'us-east-1' });

let unprocessedItems = [];

const reprocess = async items => {
  const moreUnprocessedItems = [];

  for (let item of items) {
    await documentClient
      .batchWrite({
        RequestItems: item,
      })
      .promise()
      .then(results => {
        if (!isEmpty(results.UnprocessedItems)) {
          moreUnprocessedItems.push(results.UnprocessedItems);
        }
      });
  }

  if (moreUnprocessedItems.length) {
    reprocess(moreUnprocessedItems);
  }
};

const scanTableSegment = async (segment, totalSegments) => {
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

        const chunks = chunk(results.Items, CHUNK_SIZE);
        for (let c of chunks) {
          // eslint-disable-next-line promise/no-nesting
          await documentClient
            .batchWrite({
              RequestItems: {
                [`efcms-${process.env.ENVIRONMENT}`]: c.map(item => ({
                  PutRequest: {
                    Item: {
                      ...item,
                      migrate: true,
                    },
                  },
                })),
              },
            })
            .promise()
            .then(results => {
              if (!isEmpty(results.UnprocessedItems)) {
                unprocessedItems.push(results.UnprocessedItems);
              }
            });
        }
      });
  }

  await reprocess(unprocessedItems);
};

exports.handler = async event => {
  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { segment, totalSegments } = JSON.parse(body);

  console.log(`about to process ${segment} of ${totalSegments}`);

  await scanTableSegment(segment, totalSegments);
  await sqs
    .deleteMessage({
      QueueUrl: process.env.SEGMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
