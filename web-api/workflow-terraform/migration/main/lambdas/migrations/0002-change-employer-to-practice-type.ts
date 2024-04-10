import type { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';

const isUserRecord = item => {
  return item.pk.startsWith('user|');
};

const isRecordToUpdate = item => {
  return isUserRecord(item);
};

export const migrateItems = async (
  items: any[],
  applicationContext: IApplicationContext,
) => {
  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (isRecordToUpdate(item)) {
      if (item.role && item.role.includes('Practitioner')) {
        item.practiceType = item.employer;
        delete item.employer;
        applicationContext.logger.log('updated practitioner:', item);
      }
    }
    itemsAfter.push(item);
  }

  return itemsAfter;
};
