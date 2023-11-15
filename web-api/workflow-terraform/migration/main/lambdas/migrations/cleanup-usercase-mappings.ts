import { TDynamoRecord } from '../../../../../src/persistence/dynamo/dynamoTypes';

const isUserCaseRecord = item => {
  return item.pk.startsWith('user|') && item.sk.startsWith('case|');
};

export const migrateItems = items => {
  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (isUserCaseRecord(item)) {
      itemsAfter.push({
        docketNumber: item.docketNumber,
        gsi1pk: item.gsi1pk,
        pk: item.pk,
        sk: item.sk,
      });
    } else {
      itemsAfter.push(item);
    }
  }

  return itemsAfter;
};
