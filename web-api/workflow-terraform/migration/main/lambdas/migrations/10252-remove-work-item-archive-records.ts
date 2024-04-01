import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';

const isWorkItemArchiveRecord = item => {
  return (
    (item.pk.startsWith('user-outbox|') ||
      item.pk.startsWith('section-outbox|')) &&
    item.pk.split('|').length === 3
  );
};

export const migrateItems = items => {
  let itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (!isWorkItemArchiveRecord(item)) {
      itemsAfter.push(item);
    }

    return itemsAfter;
  }
};
