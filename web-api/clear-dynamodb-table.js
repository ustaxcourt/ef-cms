const AWS = require('aws-sdk');
const { chunk } = require('lodash');
const args = process.argv.slice(2);
const env = args.length ? args[0] : 'dev';

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

documentClient
  .scan({
    TableName: `efcms-${env}`,
  })
  .promise()
  .then(async documents => {
    console.log(`needing to clear ${documents.length} documents`);
    const chunks = chunk(documents.Items, 25);
    let ci = 1;
    for (let c of chunks) {
      console.log(`chunk ${ci++} of ${chunks.length}`);
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
