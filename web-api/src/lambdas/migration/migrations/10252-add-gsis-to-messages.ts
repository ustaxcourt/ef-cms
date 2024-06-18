import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { calculateTimeToLive } from '@web-api/persistence/dynamo/calculateTimeToLive';

const isMessage = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('message|');
};

export const migrateItems = items => {
  const itemsAfter: TDynamoRecord[] = [];
  for (const item of items) {
    if (isMessage(item)) {
      if (!item.completedAt) {
        const ttl = calculateTimeToLive({
          numDays: 8,
          timestamp: item.createdAt!,
        });

        // add outbox records
        itemsAfter.push({
          ...item,
          gsi1pk: undefined,
          pk: `message|outbox|user|${item.fromUserId}`,
          sk: item.createdAt,
          ttl: ttl.expirationTimestamp,
        });
        itemsAfter.push({
          ...item,
          gsi1pk: undefined,
          pk: `message|outbox|section|${item.fromSection}`,
          sk: item.createdAt,
          ttl: ttl.expirationTimestamp,
        });

        // add global secondary indexes
        item.gsiUserBox = item.toUserId
          ? `assigneeId|${item.toUserId}`
          : undefined;
        item.gsiSectionBox = item.toSection
          ? `section|${item.toSection}`
          : undefined;
        itemsAfter.push(item);
      } else {
        const ttl = calculateTimeToLive({
          numDays: 8,
          timestamp: item.completedAt!,
        });

        // add completed box records
        itemsAfter.push({
          ...item,
          gsi1pk: undefined,
          pk: `message|completed|user|${item.completedByUserId}`,
          sk: item.completedAt!,
          ttl: ttl.expirationTimestamp,
        });
        itemsAfter.push({
          ...item,
          gsi1pk: undefined,
          pk: `message|completed|section|${item.completedBySection}`,
          sk: item.completedAt!,
          ttl: ttl.expirationTimestamp,
        });

        // completed message does not get global secondary indexes
        itemsAfter.push({
          ...item,
          gsiSectionBox: undefined,
          gsiUserBox: undefined,
        });
      }
    }
  }

  return itemsAfter;
};
