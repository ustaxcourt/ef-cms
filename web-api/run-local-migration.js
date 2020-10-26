const AWS = require('aws-sdk');
const {
  processItems,
} = require('./migration-terraform/main/lambdas/migration-segments');

(async () => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:8000',
    region: 'us-east-1',
  });

  await documentClient
    .scan({
      ExclusiveStartKey: null,
      Segment: 0,
      TableName: 'efcms-local',
      TotalSegments: 1,
    })
    .promise()
    .then(async results => {
      await processItems({ documentClient, items: results.Items });
    });
})();
