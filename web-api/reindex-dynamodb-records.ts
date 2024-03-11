import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { chunk } from 'lodash';
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('must provide a table to reindex: [efcms-dev-1]');
  process.exit(1);
}

const tableName = args[0];
const CHUNK_SIZE = 25;

const dynamodb = new DynamoDBClient({
  maxAttempts: 10,
  region: 'us-east-1',
});
const documentClient = DynamoDBDocument.from(dynamodb, {
  marshallOptions: { removeUndefinedValues: true },
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function () {
  let hasMoreResults = true;
  let lastKey: Record<string, any> | undefined;
  let count = 0;
  while (hasMoreResults) {
    hasMoreResults = false;

    await documentClient
      .scan({
        ExclusiveStartKey: lastKey,
        TableName: tableName,
      })
      .then(async results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;

        const chunks = chunk(results.Items, CHUNK_SIZE);
        for (let c of chunks) {
          count += CHUNK_SIZE;
          console.log(`reindexing chunk: ${count} total reindexed`);

          await documentClient.batchWrite({
            RequestItems: {
              [tableName]: c.map(item => ({
                PutRequest: {
                  Item: { ...item, indexedTimestamp: Date.now() },
                },
              })),
            },
          });
        }
      });
  }
})();
