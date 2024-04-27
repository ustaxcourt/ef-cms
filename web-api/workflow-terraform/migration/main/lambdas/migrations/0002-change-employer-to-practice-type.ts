import type { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';

const isUserRecord = item => {
  return item.pk.startsWith('user|');
};

const isRecordToUpdate = item => {
  return isUserRecord(item);
};

export const migrateItems = (
  items: any[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applicationContext: IApplicationContext,
) => {
  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (isRecordToUpdate(item)) {
      if (item.role && item.role.includes('Practitioner')) {
        item.practiceType = item.employer;
        delete item.employer;
      }
    }
    itemsAfter.push(item);
  }

  return itemsAfter;
};
