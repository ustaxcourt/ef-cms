import { STANDING_PRETRIAL_EVENT_CODES } from '../../../../../../shared/src/business/entities/EntityConstants';
import { TDynamoRecord } from '../../../../../src/persistence/dynamo/dynamoTypes';

const isDocketEntryItem = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|');
};

export const migrateItems = items => {
  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (
      isDocketEntryItem(item) &&
      STANDING_PRETRIAL_EVENT_CODES.includes(item.eventCode) &&
      item.signedJudgeName
    ) {
      item.judge = item.signedJudgeName;
      item.signedAt = undefined;
      item.signedByUserId = undefined;
      item.signedJudgeName = undefined;
    }

    itemsAfter.push(item);
  }

  return itemsAfter;
};
