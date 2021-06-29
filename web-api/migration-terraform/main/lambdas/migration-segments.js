const AWS = require('aws-sdk');
const createApplicationContext = require('../../../src/applicationContext');
const promiseRetry = require('promise-retry');

const {
  migrateItems: migration0002,
} = require('./migrations/0002-original-bar-state');
const {
  migrateItems: migration0027B,
} = require('./migrations/0027-require-service-indicator-for-petitioner');
const {
  migrateItems: migration0030,
} = require('./migrations/0030-docket-entry-docket-number-required');
const {
  migrateItems: migration0031,
} = require('./migrations/0031-add-filers-to-docket-entry');
const {
  migrateItems: migration0032,
} = require('./migrations/0032-contact-type-other-filers');
const {
  migrateItems: migration0033,
} = require('./migrations/0033-contact-type-other-petitioner');
const {
  migrateItems: migration0034,
} = require('./migrations/0034-contact-type-primary-secondary');
const {
  migrateItems: validationMigration,
} = require('./migrations/0000-validate-all-items');
const { chunk } = require('lodash');

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
  applicationContext.logger.info('about to run migration 0001');

  applicationContext.logger.info('about to run migration 0027B');
  items = await migration0027B(items, documentClient);

  applicationContext.logger.debug('about to run migration 0030');
  items = await migration0030(items);

  applicationContext.logger.debug('about to run migration 0031');
  items = await migration0031(items, documentClient);

  applicationContext.logger.debug('about to run migration 0032');
  items = await migration0032(items);

  applicationContext.logger.debug('about to run migration 0033');
  items = await migration0033(items);

  applicationContext.logger.debug('about to run migration 0034');
  items = await migration0034(items);

  applicationContext.logger.info('about to run migration 0002');
  items = migration0002(items);

  applicationContext.logger.debug('about to run validation migration');
  items = await validationMigration(items);

  return items;
};

exports.migrateRecords = migrateRecords;

const processItems = async ({ documentClient, items }) => {
  try {
    items = await migrateRecords({ documentClient, items });
  } catch (err) {
    applicationContext.logger.error('Error migrating records', err);
    throw err;
  }

  const chunks = chunk(items, MAX_DYNAMO_WRITE_SIZE);
  for (let aChunk of chunks) {
    const promises = [];
    for (let item of aChunk) {
      promises.push(
        promiseRetry(retry => {
          return documentClient
            .put({
              ConditionExpression: 'attribute_not_exists(pk)',
              Item: item,
              TableName: process.env.DESTINATION_TABLE,
            })
            .promise()
            .catch(e => {
              if (e.message.includes('The conditional request failed')) {
                console.log(
                  `The item of ${item.pk} ${item.sk} alread existed in the destination table, probably due to a live migration.  Skipping migration for this item.`,
                );
              } else {
                throw e;
              }
            })
            .catch(retry);
        }),
      );
    }
    await Promise.all(promises);
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
