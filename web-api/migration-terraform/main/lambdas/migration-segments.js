const AWS = require('aws-sdk');
const {
  migrateItems: migration0001,
} = require('./migrations/0001-eligible-for-trial-case-id');
const {
  migrateItems: migration0002,
} = require('./migrations/0002-case-deadline-catalog');
const { chunk, isEmpty } = require('lodash');
const MAX_DYNAMO_WRITE_SIZE = 25;

const dynamodb = new AWS.DynamoDB({
  maxRetries: 10,
  region: 'us-east-1',
  retryDelayOptions: { base: 300 },
});

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
  service: dynamodb,
});

const sqs = new AWS.SQS({ region: 'us-east-1' });

const reprocessItems = async items => {
  const moreUnprocessedItems = [];

  items = migration0001(items);
  items = await migration0002(items, documentClient);

  for (let item of items) {
    const results = await documentClient
      .batchWrite({
        RequestItems: item,
      })
      .promise();

    if (!isEmpty(results.UnprocessedItems)) {
      moreUnprocessedItems.push(results.UnprocessedItems);
    }
  }

  if (moreUnprocessedItems.length) {
    await reprocessItems(moreUnprocessedItems);
  }
};

const processItems = async ({ documentClient, items }) => {
  // your migration code goes here
  const chunks = chunk(items, MAX_DYNAMO_WRITE_SIZE);
  for (let c of chunks) {
    c = migration0001(c);
    c = await migration0002(c, documentClient);

    const results = await documentClient
      .batchWrite({
        RequestItems: {
          [process.env.DESTINATION_TABLE]: c.map(item => ({
            PutRequest: {
              Item: {
                ...item,
              },
            },
          })),
        },
      })
      .promise();

    if (!isEmpty(results.UnprocessedItems)) {
      await reprocessItems([results.UnprocessedItems]);
    }
  }
};

exports.processItems = processItems;

const scanTableSegment = async (segment, totalSegments) => {
  let hasMoreResults = true;
  let lastKey = null;
  while (hasMoreResults) {
    hasMoreResults = false;

    await documentClient
      .scan({
        ExclusiveStartKey: lastKey,
        Segment: segment,
        TableName: process.env.SOURCE_TABLE,
        TotalSegments: totalSegments,
      })
      .promise()
      .then(async results => {
        console.log('got some results', results.Items.length);
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;
        await processItems({ documentClient, items: results.Items });
      });
  }
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
