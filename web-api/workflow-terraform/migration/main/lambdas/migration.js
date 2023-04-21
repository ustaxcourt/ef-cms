const AWS = require('aws-sdk');
const {
  createApplicationContext,
} = require('../../../../src/applicationContext');
const { createLogger } = require('../../../../src/createLogger');
const { migrateRecords: migrations } = require('./migration-segments');

const dynamodb = new AWS.DynamoDB({
  maxRetries: 10,
  retryDelayOptions: { base: 300 },
});

const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
  service: dynamodb,
});

const processItems = async (
  applicationContext,
  { documentClient, items, migrateRecords },
) => {
  const promises = [];

  items = await migrateRecords(applicationContext, { documentClient, items });

  for (const item of items) {
    promises.push(
      documentClient
        .put({
          Item: item,
          TableName: process.env.DESTINATION_TABLE,
        })
        .promise(),
    );
  }
  await Promise.all(promises);
};

const getFilteredGlobalEvents = event => {
  const { Records } = event;
  return Records.filter(item => item.eventName !== 'REMOVE').map(item =>
    AWS.DynamoDB.Converter.unmarshall(item.dynamodb.NewImage),
  );
};

const getRemoveEvents = event => {
  const { Records } = event;
  return Records.filter(item => item.eventName === 'REMOVE').map(item =>
    AWS.DynamoDB.Converter.unmarshall(item.dynamodb.OldImage),
  );
};

exports.getFilteredGlobalEvents = getFilteredGlobalEvents;
exports.processItems = processItems;
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
  const items = getFilteredGlobalEvents(event);
  await processItems(applicationContext, {
    documentClient: docClient,
    items,
    migrateRecords: migrations,
  });

  const removeEvents = getRemoveEvents(event);
  await Promise.all(
    removeEvents.map(item =>
      docClient
        .delete({
          Key: {
            pk: item.pk,
            sk: item.sk,
          },
          TableName: process.env.DESTINATION_TABLE,
        })
        .promise(),
    ),
  );
};
