/* eslint-disable max-lines */
const AWS = require('aws-sdk');
const { chunk, uniq } = require('lodash');

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

const removeAWSGlobalFields = item => {
  if (item) {
    delete item['aws:rep:deleting'];
    delete item['aws:rep:updateregion'];
    delete item['aws:rep:updatetime'];
  }
  return item;
};

const getCasesByDocketNumbers = async keys => {
  keys = uniq(keys).map(docketNumber => ({
    pk: `case|${docketNumber}`,
    sk: `case|${docketNumber}`,
  }));

  const chunks = chunk(keys, 100);

  let results = [];
  for (let chunkOfKeys of chunks) {
    results = results.concat(
      await dynamoDbDocumentClient
        .batchGet({
          RequestItems: {
            [process.env.SOURCE_TABLE]: {
              Keys: chunkOfKeys,
            },
          },
        })
        .promise()
        .then(result => {
          const items = result.Responses[process.env.SOURCE_TABLE];
          items.forEach(item => removeAWSGlobalFields(item));
          return items;
        }),
    );
  }

  return results;
};

// trial session's caseOrder array
const badCases = [];
const docketNumbers = badCases.map(d => d.docketNumber);

getCasesByDocketNumbers(docketNumbers).then(items => {
  //todo: return this as actual JSON
  console.log(items.toJSON());
});
