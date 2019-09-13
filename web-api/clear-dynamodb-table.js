const AWS = require('aws-sdk');
const { chunk } = require('lodash');
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('must provide an environment to delete: [dev, stg, prod]');
  process.exit(1);
}

const env = args[0];

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

(async function() {
  let hasMoreResults = true;
  let lastKey = null;
  let count = 0;
  while (hasMoreResults) {
    hasMoreResults = false;

    await documentClient
      .scan({
        ExclusiveStartKey: lastKey,
        TableName: `efcms-${env}`,
      })
      .promise()
      .then(async results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;

        const chunks = chunk(results.Items, 25);
        for (let c of chunks) {
          count += 25;
          console.log(`deleting chunk: ${count} total deleted`);

          await documentClient
            .batchWrite({
              RequestItems: {
                [`efcms-${env}`]: c.map(item => ({
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
