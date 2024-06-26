// usage: npx ts-node --transpile-only scripts/run-once-scripts/add-gsis-to-work-items.ts

import {
  ServerApplicationContext,
  createApplicationContext,
} from '../../web-api/src/applicationContext';
import { scan } from '../../web-api/src/persistence/dynamodbClientService';
import {
  PutRequest,
  TDynamoRecord,
} from '../../web-api/src/persistence/dynamo/dynamoTypes';
import { batchWrite } from './cleanup-usercase-records';

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

  return items as unknown as TDynamoRecord[];
};

// extract to helper? Zach - I think this function and batchWrite need to be extracted to a file because they have scripts at the bottom which means unintentional scripts will run on import.
export async function updateRecords(
  applicationContext: ServerApplicationContext,
  migratedRecords: TDynamoRecord[],
): Promise<void> {
  const putRequests: PutRequest[] = migratedRecords.map(workItemRecord => {
    return {
      PutRequest: { Item: workItemRecord },
    };
  });
  await batchWrite(applicationContext, putRequests);
}

(async () => {
  const applicationContext = createApplicationContext({});
  const workItems = await findWorkItems({ applicationContext });
  const migratedItems = migrateItems(workItems);

  updateRecords(applicationContext, migratedItems);
})();
