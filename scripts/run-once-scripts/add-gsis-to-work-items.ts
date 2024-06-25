// usage: npx ts-node --transpile-only scripts/run-once-scripts/add-gsis-to-work-items.ts

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { createApplicationContext } from '../../web-api/src/applicationContext';
import { DynamoDBDocument, PutCommand } from '@aws-sdk/lib-dynamodb';
import {
  batchWrite,
  scan,
} from '../../web-api/src/persistence/dynamodbClientService';

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamodbClient, {
  marshallOptions: { removeUndefinedValues: true },
});

const findWorkItems = async ({ applicationContext }) => {
  const result = await scan({
    ExpressionAttributeValues: {
      ':pk_prefix': 'case|',
      ':sk_prefix': 'work-item|',
    },
    FilterExpression:
      'begins_with(pk, :pk_prefix) AND begins_with(sk, :sk_prefix)',
    applicationContext,
  });
  return result;
};

const migrateItems = items => {
  for (const item of items) {
    if (!item.completedAt && (item.inProgress || item.caseIsInProgress)) {
      item.gsiUserBox = item.assigneeId
        ? `assigneeId|inProgress|${item.assigneeId}`
        : undefined;
      item.gsiSectionBox = item.section
        ? `section|inProgress|${item.section}`
        : undefined;
    } else if (!item.completedAt) {
      item.gsiUserBox = item.assigneeId
        ? `assigneeId|inbox|${item.assigneeId}`
        : undefined;
      item.gsiSectionBox = item.section
        ? `section|inbox|${item.section}`
        : undefined;
    }
    item.gsi2pk = undefined;
  }

  return items;
};

(async () => {
  const applicationContext = createApplicationContext({});
  const workItems = await findWorkItems({ applicationContext });
  const migratedItems = migrateItems(workItems);

  //   batchWrite(request, applicationContext)
})();
