const AWS = require('aws-sdk');
const { chunk } = require('lodash');

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

documentClient
  .scan({
    TableName: 'efcms-dev',
  })
  .promise()
  .then(async documents => {
    const chunks = chunk(documents.Items, 25);
    for (let c of chunks) {
      await documentClient.batchWrite({
        RequestItems: {
          'efcms-dev': c.map(item => (
            {
              DeleteRequest: {
                Key: { 
                  pk: item.pk,
                  sk: item.sk 
                },
              },
            })
          )
        }
      }).promise();
    }
  });
