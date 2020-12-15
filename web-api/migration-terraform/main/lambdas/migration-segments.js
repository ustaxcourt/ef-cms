const AWS = require('aws-sdk');
const createApplicationContext = require('../../../src/applicationContext');
const {
  migrateItems: migration0001,
} = require('./migrations/0001-user-case-add-closed-date');
const {
  migrateItems: migration0002,
} = require('./migrations/0002-private-practitioner-representing');
const {
  migrateItems: migration0003,
} = require('./migrations/0003-legacy-eligible-for-trial');
const {
  migrateItems: migration0004,
} = require('./migrations/0004-standing-pretrial-order-signatures');
const {
  migrateItems: migration0005,
} = require('./migrations/0005-block-case-with-legacy-served-and-pending-items');
const {
  migrateItems: migration0006,
} = require('./migrations/0006-eservice-indicator-has-eaccess');
const {
  migrateItems: migration0007,
} = require('./migrations/0007-unblock-migrated-calendared-cases');
const {
  migrateItems: migration0008,
} = require('./migrations/0008-associated-judge-on-deadlines');
const {
  migrateItems: migration0009,
} = require('./migrations/0009-remove-blocked-cases-from-eligible-for-trial-record');
const {
  migrateItems: migration0010,
} = require('./migrations/0010-remove-trial-date-if-no-trial-session-id');
const { chunk, isEmpty } = require('lodash');

const MAX_DYNAMO_WRITE_SIZE = 25;

const applicationContext = createApplicationContext({});
const dynamodb = new AWS.DynamoDB({
  maxRetries: 10,
  region: 'us-east-1',
  retryDelayOptions: { base: 300 },
});

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
  service: dynamodb,
});

const sqs = new AWS.SQS({ region: 'us-east-1' });

const migrateRecords = async ({ documentClient, items }) => {
  // migration 10 is at the top because it is fixing invalid case data; if one of the other migrations
  // that also validates the case runs before it, the data would be invalid because this migration had
  // not been run yet
  items = await migration0010(items, documentClient);
  applicationContext.logger.info('about to run migration 001');
  items = await migration0001(items, documentClient);
  applicationContext.logger.info('about to run migration 002');
  items = await migration0002(items, documentClient);
  applicationContext.logger.info('about to run migration 003');
  items = await migration0003(items, documentClient);
  applicationContext.logger.info('about to run migration 004');
  items = await migration0004(items, documentClient);
  applicationContext.logger.info('about to run migration 005');
  items = await migration0005(items, documentClient);
  applicationContext.logger.info('about to run migration 006');
  items = await migration0006(items, documentClient);
  items = await migration0007(items, documentClient);
  items = await migration0008(items, documentClient);
  items = await migration0009(items, documentClient);

  return items;
};

const reprocessItems = async ({ documentClient, items }) => {
  // items already been migrated. they simply could not be processed in the batchWrite. Try again recursively
  const numUnprocessed = items[process.env.DESTINATION_TABLE].length;
  applicationContext.logger.info(`reprocessing ${numUnprocessed} items`);
  const results = await documentClient
    .batchWrite({
      RequestItems: items,
    })
    .promise();
  if (!isEmpty(results.UnprocessedItems)) {
    await reprocessItems({
      documentClient,
      items: results.UnprocessedItems,
    });
  }
};

const processItems = async ({ documentClient, items }) => {
  try {
    items = await migrateRecords({ documentClient, items });
  } catch (err) {
    applicationContext.logger.error('Error migrating records', err);
    throw err;
  }

  // your migration code goes here
  const chunks = chunk(items, MAX_DYNAMO_WRITE_SIZE);
  for (let c of chunks) {
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
      await reprocessItems({
        documentClient,
        items: results.UnprocessedItems,
      });
    }
  }
};

exports.processItems = processItems;

const scanTableSegment = async (segment, totalSegments) => {
  let hasMoreResults = true;
  let lastKey = null;
  while (hasMoreResults) {
    hasMoreResults = false;

    await dynamoDbDocumentClient
      .scan({
        ExclusiveStartKey: lastKey,
        Segment: segment,
        TableName: process.env.SOURCE_TABLE,
        TotalSegments: totalSegments,
      })
      .promise()
      .then(async results => {
        applicationContext.logger.info(
          `${segment}/${totalSegments} got ${results.Items.length} results`,
        );
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;
        await processItems({
          documentClient: dynamoDbDocumentClient,
          items: results.Items,
        });
      });
  }
};

exports.handler = async event => {
  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { segment, totalSegments } = JSON.parse(body);

  applicationContext.logger.info(
    `about to process ${segment} of ${totalSegments}`,
  );

  await scanTableSegment(segment, totalSegments);
  applicationContext.logger.info(`finishing ${segment} of ${totalSegments}`);
  await sqs
    .deleteMessage({
      QueueUrl: process.env.SEGMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
