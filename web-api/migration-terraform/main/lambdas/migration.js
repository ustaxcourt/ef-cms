const AWS = require('aws-sdk');
const { chunk, isEmpty } = require('lodash');
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
    console.log(`Reprocessing ${moreUnprocessedItems.length} more items.`);

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
      console.log(`Reprocessing ${results.UnprocessedItems.length} items.`);
      await reprocessItems([results.UnprocessedItems]);
    }
  }
};

exports.handler = async event => {
  const { Records } = event;
  const items = Records.map(item =>
    AWS.DynamoDB.Converter.unmarshall(item.dynamodb.NewImage),
  );
  await processItems(items);
};
