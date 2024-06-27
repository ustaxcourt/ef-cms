// usage: npx ts-node --transpile-only scripts/run-once-scripts/remove-work-item-archive-records.ts

import { createApplicationContext } from '../../web-api/src/applicationContext';
import {
  batchDelete,
  scan,
} from '../../web-api/src/persistence/dynamodbClientService';

const findWorkItemArchiveRecords = async ({ applicationContext }) => {
  const userOutboxResults = await scan({
    // Zach - I think our version of a "scan" will put the entire DynamoDB into memory which will cause this to crash
    ExpressionAttributeValues: {
      ':prefix': 'user-outbox|',
    },
    FilterExpression: 'begins_with(pk, :prefix)',
    applicationContext,
  });
  const sectionOutboxResults = await scan({
    ExpressionAttributeValues: {
      ':prefix': 'section-outbox|',
    },
    FilterExpression: 'begins_with(pk, :prefix)',
    applicationContext,
  });
  const results = [...userOutboxResults, ...sectionOutboxResults];
  const allResults = results.filter(
    result => result.pk.split('|').length === 3,
  );

  return allResults;
};

const removeWorkItemRecords = async ({
  applicationContext,
  workItemRecords,
}) => {
  await batchDelete({ applicationContext, items: workItemRecords });
};

(async () => {
  const applicationContext = createApplicationContext({});
  const workItemRecords = await findWorkItemArchiveRecords({
    applicationContext,
  });
  console.log(workItemRecords);
  await removeWorkItemRecords({ workItemRecords, applicationContext });
})();
