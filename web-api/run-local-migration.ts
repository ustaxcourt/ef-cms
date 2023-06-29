import { createApplicationContext } from './src/applicationContext';
import { processItems } from './workflow-terraform/migration/main/lambdas/migration-segments';
import AWS from 'aws-sdk';

const applicationContext = createApplicationContext({});

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
      ExclusiveStartKey: undefined,
      Segment: 0,
      TableName: process.env.SOURCE_TABLE!,
      TotalSegments: 1,
    })
    .promise()
    .then(async results => {
      await processItems(applicationContext, {
        documentClient,
        items: results.Items,
        ranMigrations: undefined,
        segment: undefined,
      });
    });
})();
