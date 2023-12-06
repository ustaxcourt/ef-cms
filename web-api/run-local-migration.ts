import { createApplicationContext } from './src/applicationContext';
import { processItems } from './workflow-terraform/migration/main/lambdas/migration-segments';
import { scanFull } from './utilities/scanFull';
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

  const results = await scanFull(process.env.SOURCE_TABLE!, documentClient);

  await processItems(applicationContext, {
    documentClient,
    items: results,
    ranMigrations: undefined,
    segment: undefined,
  });
})();
