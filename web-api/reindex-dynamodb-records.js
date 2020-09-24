const AWS = require('aws-sdk');
const { chunk } = require('lodash');
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('must provide a table to reindex: [efcms-dev-1]');
  process.exit(1);
}

const sleep = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};
const tableName = args[0];
const CHUNK_SIZE = 25;

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

(async function () {
  let hasMoreResults = true;
  let lastKey = null;
  let count = 0;
  while (hasMoreResults) {
    hasMoreResults = false;

    await documentClient
      .scan({
        ExclusiveStartKey: lastKey,
        TableName: tableName,
      })
      .promise()
      .then(async results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;

        const chunks = chunk(results.Items, CHUNK_SIZE);
        for (let c of chunks) {
          count += CHUNK_SIZE;
          console.log(`reindexing chunk: ${count} total reindexed`);

          await documentClient
            .batchWrite({
              RequestItems: {
                [tableName]: c.map(item => ({
                  PutRequest: {
                    Item: { ...item, indexedTimestamp: Date.now() },
                  },
                })),
              },
            })
            .promise();

          await sleep(1000);
        }
      });
  }
})();
