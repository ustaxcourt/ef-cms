// usage: npx ts-node --transpile-only scripts/run-once-scripts/add-gsis-to-work-items.ts

import { createApplicationContext } from '../../web-api/src/applicationContext';
import { scan } from '../../web-api/src/persistence/dynamodbClientService';
import { TDynamoRecord } from '../../web-api/src/persistence/dynamo/dynamoTypes';
import { updateRecords } from 'scripts/run-once-scripts/scriptHelper';

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

(async () => {
  const applicationContext = createApplicationContext({});
  const workItems = await findWorkItems({ applicationContext });
  const migratedItems = migrateItems(workItems);

  updateRecords(applicationContext, migratedItems);
})();
