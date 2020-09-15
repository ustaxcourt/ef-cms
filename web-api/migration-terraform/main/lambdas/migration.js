const AWS = require('aws-sdk');
const { chunk, get, isEmpty, uniqWith } = require('lodash');
const MAX_DYNAMO_WRITE_SIZE = 25;

const dynamodb = new AWS.DynamoDB({
  maxRetries: 10,
  retryDelayOptions: { base: 300 },
});

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
  service: dynamodb,
});

const reprocessItems = async items => {
  const moreUnprocessedItems = [];

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

const processItems = async items => {
  const chunks = chunk(items, MAX_DYNAMO_WRITE_SIZE);
  for (let c of chunks) {
    const results = await documentClient
      .batchWrite({
        RequestItems: {
          [process.env.DESTINATION_TABLE]: c.map(item => ({
            PutRequest: {
              Item: item,
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

exports.handler = async event => {
  const { Records } = event;
  const items = uniqWith(
    Records.filter(record => {
      // to prevent global tables writing extra data
      const NEW_TIME_KEY = 'dynamodb.NewImage.aws:rep:updatetime.N';
      const OLD_TIME_KEY = 'dynamodb.OldImage.aws:rep:updatetime.N';
      const newTime = get(record, NEW_TIME_KEY);
      const oldTime = get(record, OLD_TIME_KEY);
      return newTime && newTime !== oldTime;
    }).map(item => AWS.DynamoDB.Converter.unmarshall(item.dynamodb.NewImage)),
    (a, b) => a.pk === b.pk && a.sk === b.sk, // to prevent the "Provided list of item keys contains duplicates" error.
  );
  await processItems(items);
};
