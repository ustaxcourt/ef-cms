import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { scanFull } from './utilities/scanFull';

const tableName = process.argv[2] ?? 'efcms-local';

if (!tableName) {
  console.error('Table name to export is required');
  process.exit(1);
}

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

  const results = await scanFull(tableName, documentClient);

  results.sort((a, b) => {
    return `${a.pk}-${a.sk}`.localeCompare(`${b.pk}-${b.sk}`);
  });
  console.log(JSON.stringify(results, null, 2));
})();
