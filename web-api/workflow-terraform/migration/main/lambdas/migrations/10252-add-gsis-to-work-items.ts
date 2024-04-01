import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { calculateTimeToLive } from '@web-api/persistence/dynamo/calculateTimeToLive';

const isWorkItem = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('work-item|');
};

export const migrateItems = items => {
  const itemsAfter: TDynamoRecord[] = [];
  for (const item of items) {
    if (isWorkItem(item)) {
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
      } else {
        const ttl = calculateTimeToLive({
          numDays: 8,
          timestamp: item.completedAt,
        });
        itemsAfter.push({
          ...item,
          gsi2pk: undefined,
          pk: `user-outbox|${item.completedByUserId}`,
          sk: item.completedAt,
          ttl: ttl.expirationTimestamp,
        });
        itemsAfter.push({
          ...item,
          gsi2pk: undefined,
          pk: `section-outbox|${item.section}`,
          sk: item.completedAt,
          ttl: ttl.expirationTimestamp,
        });
      }
      item.gsi2pk = undefined;
      itemsAfter.push(item);
    }
  }

  return itemsAfter;
};
