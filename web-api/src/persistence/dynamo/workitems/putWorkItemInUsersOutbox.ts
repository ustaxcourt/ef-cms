import { calculateTimeToLive } from '@web-api/persistence/dynamo/calculateTimeToLive';
import { put } from '@web-api/persistence/dynamodbClientService';

export const putWorkItemInUsersOutbox = async ({
  applicationContext,
  section,
  userId,
  workItem,
}) => {
  if (!workItem.completedAt) {
    return;
  }

  const ttl = calculateTimeToLive({
    numDays: 8,
    timestamp: workItem.completedAt,
  });

  if (ttl.numSeconds <= 0) {
    return;
  }

  await Promise.all([
    put({
      Item: {
        ...workItem,
        gsi1pk: `work-item|${workItem.workItemId}`,
        pk: `user-outbox|${userId}`,
        sk: workItem.completedAt,
        ttl: ttl.expirationTimestamp,
      },
      applicationContext,
    }),
    put({
      Item: {
        ...workItem,
        gsi1pk: `work-item|${workItem.workItemId}`,
        pk: `section-outbox|${section}`,
        sk: workItem.completedAt,
        ttl,
      },
      applicationContext,
    }),
  ]);
};
