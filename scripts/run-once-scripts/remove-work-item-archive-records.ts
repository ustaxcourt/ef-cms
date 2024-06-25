// usage: npx ts-node --transpile-only scripts/run-once-scripts/remove-work-item-archive-records.ts

import { DeleteCommand, DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { createApplicationContext } from '../../web-api/src/applicationContext';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import {
  batchDelete,
  scan,
} from '../../web-api/src/persistence/dynamodbClientService';

const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
});

const documentClient = DynamoDBDocument.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true },
});

const findWorkItemArchiveRecords = async ({ applicationContext }) => {
  const userOutboxResults = await scan({
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
  console.log('all results', allResults[0]);
  const resultPks = allResults.map(result => ({
    pk: result.pk,
    sk: result.sk,
  }));
  return resultPks;
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
  //   await removeWorkItemRecords({ workItemRecords, applicationContext });
})();
