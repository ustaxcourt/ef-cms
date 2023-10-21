import { TDynamoRecord } from '../../../../../src/persistence/dynamo/dynamoTypes';

const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

export const migrateItems = items => {
  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (isCaseRecord(item) && !item.caseStatusHistory) {
      item.caseStatusHistory = [];
    }
    itemsAfter.push(item);
  }

  return itemsAfter;
};
