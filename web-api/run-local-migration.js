const AWS = require('aws-sdk');
const {
  processItems,
} = require('./migration-terraform/main/lambdas/migration-segments');

(async () => {
  const dynamo = new AWS.DynamoDB({
    credentials: {
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER',
    },
    endpoint: 'http://localhost:8000',
    region: 'us-east-1',
  });

  const documentClient = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:8000',
    region: 'us-east-1',
    service: dynamo,
  });

  await documentClient
    .scan({
      ExclusiveStartKey: null,
      Segment: 0,
      TableName: process.env.SOURCE_TABLE,
      TotalSegments: 1,
    })
    .promise()
    .then(async results => {
      await processItems({ documentClient, items: results.Items });
    });
})();
