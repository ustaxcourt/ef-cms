const AWS = require('aws-sdk');
const createApplicationContext = require('../../../src/applicationContext');
const {
  migrateItems: migration0017,
} = require('./migrations/0017-remove-draft-order-state');
const {
  migrateItems: migration0018,
} = require('./migrations/0018-remove-nested-draft-order-state');
const {
  migrateItems: migration0019,
} = require('./migrations/0019-remove-values-from-cases');
const {
  migrateItems: migration0020,
} = require('./migrations/0020-add-entity-name-for-correspondences');
const {
  migrateItems: migration0021,
} = require('./migrations/0021-practitioner-search-upper-case');
const {
  migrateItems: migration0022,
} = require('./migrations/0022-practitioner-admissions-date');
const {
  migrateItems: migration0023,
} = require('./migrations/0023-set-served-docket-entries-as-completed');
const {
  migrateItems: migration0024,
} = require('./migrations/0024-add-contact-primary-to-petitioners-array');
const {
  migrateItems: validationMigration,
} = require('./migrations/0000-validate-all-items');
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

// eslint-disable-next-line no-unused-vars
const migrateRecords = async ({ documentClient, items }) => {
  applicationContext.logger.info('about to run migration 0017');
  items = await migration0017(items, documentClient);
  applicationContext.logger.info('about to run migration 0018');
  items = await migration0018(items, documentClient);
  applicationContext.logger.info('about to run migration 0019');
  items = await migration0019(items, documentClient);
  applicationContext.logger.info('about to run migration 0020');
  items = await migration0020(items, documentClient);
  applicationContext.logger.info('about to run migration 0021');
  items = await migration0021(items, documentClient);
  applicationContext.logger.info('about to run migration 0022');
  items = await migration0022(items, documentClient);
  applicationContext.logger.info('about to run migration 0023');
  items = await migration0023(items, documentClient);
  applicationContext.logger.info('about to run migration 0024');
  items = await migration0024(items, documentClient);

  applicationContext.logger.info('about to run validation migration');
  items = await validationMigration(items, documentClient);

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
