const AWS = require('aws-sdk');
const createApplicationContext = require('../../../src/applicationContext');
const promiseRetry = require('promise-retry');

const {
  migrateItems: bugMigration0035,
} = require('./migrations/bug-0035-private-practitioner-representing');
const {
  migrateItems: bugMigration0036,
} = require('./migrations/bug-0036-public-served-parties-code');
const {
  migrateItems: devexMigration0037,
} = require('./migrations/devex-0037-combine-work-items');
const {
  migrateItems: migration0036,
} = require('./migrations/0036-phone-number-format');
const {
  migrateItems: migration0038,
} = require('./migrations/0038-parse-generated-orders');
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
const migrateRecords = async ({
  documentClient,
  items,
  ranMigrations = {},
}) => {
  if (!ranMigrations['bug-0035-private-practitioner-representing.js']) {
    applicationContext.logger.info('about to run bug migration 0035');
    items = await bugMigration0035(items, documentClient);
  }

  if (!ranMigrations['bug-0036-public-served-parties-code.js']) {
    applicationContext.logger.info('about to run bug migration 0036');
    items = await bugMigration0036(items);
  }

  if (!ranMigrations['0036-phone-number-format.js']) {
    applicationContext.logger.debug('about to run migration 0036');
    items = await migration0036(items);
  }

  if (!ranMigrations['devex-0037-combine-work-items.js']) {
    applicationContext.logger.debug('about to run devex migration 0037');
    items = await devexMigration0037(items, documentClient);
  }

  if (!ranMigrations['0038-parse-generated-orders.js']) {
    applicationContext.logger.debug('about to run migration 0038');
    items = await migration0038(items);
  }

  applicationContext.logger.debug('about to run validation migration');
  items = await validationMigration(items);

  return items;
};

exports.migrateRecords = migrateRecords;

const processItems = async ({ documentClient, items, ranMigrations }) => {
  try {
    items = await migrateRecords({ documentClient, items, ranMigrations });
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

const scanTableSegment = async (segment, totalSegments, ranMigrations) => {
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
          ranMigrations,
        });
      });
  }
};

const hasMigrationRan = async key => {
  const { Item } = await dynamoDbDocumentClient
    .get({
      Key: {
        pk: `migration|${key}`,
        sk: `migration|${key}`,
      },
      TableName: `efcms-deploy-${process.env.ENVIRONMENT}`,
    })
    .promise();
  return { [key]: !!Item };
};

exports.handler = async event => {
  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { segment, totalSegments } = JSON.parse(body);

  applicationContext.logger.info(
    `about to process ${segment} of ${totalSegments}`,
  );

  const ranMigrations = {
    ...(await hasMigrationRan('bug-0035-private-practitioner-representing.js')),
    ...(await hasMigrationRan('bug-0036-public-served-parties-code.js')),
    ...(await hasMigrationRan('0036-phone-number-format.js')),
    ...(await hasMigrationRan('devex-0037-combine-work-items.js')),
    ...(await hasMigrationRan('0038-parse-generated-orders.js')),
  };

  await scanTableSegment(segment, totalSegments, ranMigrations);
  applicationContext.logger.info(`finishing ${segment} of ${totalSegments}`);
  await sqs
    .deleteMessage({
      QueueUrl: process.env.SEGMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
