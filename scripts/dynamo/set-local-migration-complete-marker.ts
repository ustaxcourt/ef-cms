import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { v4 as uuidv4 } from 'uuid';

const now = formatNow(FORMATS.ISO);
const ttl = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS)) + 3600;
const workflowId = uuidv4();

const completionMarker = {
  apiToken: 'openSesame',
  completedAt: now,
  entityName: 'CompletionMarker',
  environment: 'local',
  jobName: 'wait-for-reindex',
  pk: 'completion-marker',
  sk: `completion-marker|${workflowId}`,
  ttl,
  workflowId,
};

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});
const docClient = DynamoDBDocumentClient.from(client);
const putCommand = new PutCommand({
  Item: completionMarker,
  TableName: 'efcms-local',
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  console.log('Inserting completion marker', completionMarker);
  await docClient.send(putCommand);
})();
