// this could potentially be used for the start of a migration script

const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

(async function() {
  let hasMoreResults = true;
  let lastKey = null;
  while (hasMoreResults) {
    hasMoreResults = false;
    console.log('making a scan request');

    await documentClient
      .scan({
        ExclusiveStartKey: lastKey,
        TableName: 'efcms-dev'
      })
      .promise()
      .then(async results => {
        console.log('results.Count', results.Count);
        hasMoreResults = !!results.LastEvaluatedKey
        lastKey = results.LastEvaluatedKey;
  
        for (const result of results.Items) {
          if (result.gsi1pk && result.gsi1pk.indexOf('workitem-') !== -1) {
            if (!result.document.receivedAt) {
              result.document.receivedAt = result.document.createdAt;
              await documentClient.put({
                Item: result,
                TableName: 'efcms-dev',
              }).promise();
            }
          }
        }
      });
  
  }
  
})();
