const AWS = require('aws-sdk');
const createApplicationContext = require('../../../src/applicationContext');
const promiseRetry = require('promise-retry');
const {
  migrateItems: bugMigration0039,
} = require('./migrations/bug-0039-notice-of-trial-date');
const {
  migrateItems: migration0001,
} = require('./migrations/0001-update-websockets-gsi1pk');
const {
  migrateItems: migration0002,
} = require('./migrations/0002-session-scope');
const {
  migrateItems: migration0040,
} = require('./migrations/bug-0040-case-received-at');
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

const migrateRecords = async ({
  // eslint-disable-next-line no-unused-vars
  documentClient,
  items,
  // eslint-disable-next-line no-unused-vars
  ranMigrations = {},
}) => {
  if (!ranMigrations['0001-update-websockets-gsi1pk.js']) {
    applicationContext.logger.debug('about to run migration 0001');
    items = migration0001(items);
  }

  if (!ranMigrations['0002-session-scope.js']) {
    applicationContext.logger.debug('about to run migration 0002');
    items = migration0002(items);
  }

  if (!ranMigrations['bug-0040-case-received-at.js']) {
    applicationContext.logger.debug('about to run migration 0040');
    items = await migration0040(items, documentClient);
  }

  if (!ranMigrations['bug-0039-notice-of-trial-date.js']) {
    applicationContext.logger.debug('about to run bug migration 0039');
    items = await bugMigration0039(items, documentClient);
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

// eslint-disable-next-line
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
    ...(await hasMigrationRan('0001-update-websockets-gsi1pk.js')),
    ...(await hasMigrationRan('0002-session-scope.js')),
    ...(await hasMigrationRan('bug-0039-notice-of-trial-date.js')),
    ...(await hasMigrationRan('bug-0040-case-received-at.js')),
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
