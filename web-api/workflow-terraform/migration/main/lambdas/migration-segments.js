const AWS = require('aws-sdk');
const promiseRetry = require('promise-retry');
const {
  createApplicationContext,
} = require('../../../../src/applicationContext');
const {
  createISODateString,
  dateStringsCompared,
} = require('../../../../../shared/src/business/utilities/DateHandler');
const {
  migrateItems: validationMigration,
} = require('./migrations/0000-validate-all-items');
const { chunk } = require('lodash');
const { createLogger } = require('../../../../src/createLogger');
const { migrationsToRun } = require('./migrationsToRun');

const MAX_DYNAMO_WRITE_SIZE = 25;

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

const scanTableSegment = async (
  applicationContext,
  segment,
  totalSegments,
  ranMigrations,
) => {
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
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;
        await exports.processItems(applicationContext, {
          documentClient: dynamoDbDocumentClient,
          items: results.Items,
          ranMigrations,
          segment,
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
      TableName: `efcms-deploy-${process.env.STAGE}`,
    })
    .promise();
  return { [key]: !!Item };
};

exports.migrateRecords = async (
  applicationContext,
  { documentClient, items, ranMigrations = {} },
) => {
  for (let { key, script } of migrationsToRun) {
    if (!ranMigrations[key]) {
      applicationContext.logger.debug(`about to run migration ${key}`);
      items = await script(items, documentClient);
    }
  }

  applicationContext.logger.debug('about to run validation migration');
  items = await validationMigration(items);

  return items;
};

exports.processItems = async (
  applicationContext,
  { documentClient, items, ranMigrations },
) => {
  try {
    items = await exports.migrateRecords(applicationContext, {
      documentClient,
      items,
      ranMigrations,
    });
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
                applicationContext.logger.info(
                  `The item of ${item.pk} ${item.sk} already existed in the destination table, probably due to a live migration.  Skipping migration for this item.`,
                );
                return 'already-migrated';
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

exports.handler = async (event, context) => {
  const applicationContext = createApplicationContext(
    {},
    createLogger({
      defaultMeta: {
        environment: {
          stage: process.env.STAGE || 'local',
        },
        requestId: {
          lambda: context.awsRequestId,
        },
      },
    }),
  );
  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { segment, totalSegments } = JSON.parse(body);

  const start = createISODateString();

  applicationContext.logger.info('about to process segment', {
    segment,
    totalSegments,
  });
  const ranMigrations = {};
  for (let { key } of migrationsToRun) {
    Object.assign(ranMigrations, await hasMigrationRan(key));
  }

  await scanTableSegment(
    applicationContext,
    segment,
    totalSegments,
    ranMigrations,
  );
  const finish = createISODateString();
  const duration = dateStringsCompared(finish, start, { exact: true });
  applicationContext.logger.info('finishing segment', {
    duration,
    segment,
    totalSegments,
  });
  await sqs
    .deleteMessage({
      QueueUrl: process.env.SEGMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
