const AWS = require('aws-sdk');
const { get } = require('lodash');
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

const processItems = async ({ documentClient, items, migrateRecords }) => {
  const promises = [];

  items = await migrateRecords({ documentClient, items });

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
  return Records.filter(record => {
    // to prevent global tables writing extra data
    const NEW_TIME_KEY = 'dynamodb.NewImage.aws:rep:updatetime.N';
    const OLD_TIME_KEY = 'dynamodb.OldImage.aws:rep:updatetime.N';
    const newTime = get(record, NEW_TIME_KEY);
    const oldTime = get(record, OLD_TIME_KEY);
    return newTime && newTime !== oldTime;
  }).map(item => AWS.DynamoDB.Converter.unmarshall(item.dynamodb.NewImage));
};

exports.getFilteredGlobalEvents = getFilteredGlobalEvents;
exports.processItems = processItems;
exports.handler = async event => {
  const items = getFilteredGlobalEvents(event);
  await processItems({
    documentClient: docClient,
    items,
    migrateRecords: migrations,
  });
};
