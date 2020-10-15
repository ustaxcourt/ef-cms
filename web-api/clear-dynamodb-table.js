const AWS = require('aws-sdk');
const { chunk } = require('lodash');
const args = process.argv.slice(2);
const CHUNK_SIZE = 25;

if (args.length < 1) {
  console.error(
    'must provide a dynamodb table name to clear: [efcms-dev, efcms-dev-1]',
  );
  process.exit(1);
}

const dynamoDbTableName = args[0];

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
        TableName: dynamoDbTableName,
      })
      .promise()
      .then(async results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;

        const chunks = chunk(results.Items, CHUNK_SIZE);
        for (let c of chunks) {
          count += CHUNK_SIZE;
          console.log(`deleting chunk: ${count} total deleted`);

          await documentClient
            .batchWrite({
              RequestItems: {
                [dynamoDbTableName]: c.map(item => ({
                  DeleteRequest: {
                    Key: {
                      pk: item.pk,
                      sk: item.sk,
                    },
                  },
                })),
              },
            })
            .promise();
        }
      });
  }
})();
