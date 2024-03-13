import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { createApplicationContext } from './src/applicationContext';
import { processItems } from './workflow-terraform/migration/main/lambdas/migration-segments';
import { scanFull } from './utilities/scanFull';

const applicationContext = createApplicationContext({});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const dynamodb = new DynamoDBClient({
    credentials: {
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER',
    },
    endpoint: 'http://localhost:8000',
    region: 'us-east-1',
  });

  const documentClient = DynamoDBDocument.from(dynamodb, {
    marshallOptions: { removeUndefinedValues: true },
  });

  const results = await scanFull(process.env.SOURCE_TABLE!, documentClient);

  await processItems(applicationContext, {
    documentClient,
    items: results,
    ranMigrations: undefined,
  });
})();
