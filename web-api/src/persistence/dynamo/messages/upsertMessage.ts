import { RawMessage } from '@shared/business/entities/Message';
import { calculateTimeToLive } from '@web-api/persistence/dynamo/calculateTimeToLive';
import { put } from '../../dynamodbClientService';

export const upsertMessage = async ({
  applicationContext,
  message,
}: {
  applicationContext: IApplicationContext;
  message: RawMessage;
}): Promise<void> => {
  let gsiUserBox, gsiSectionBox;

  await putMessageInOutbox({ applicationContext, message });

  if (!message.completedAt) {
    // user inbox
    gsiUserBox = message.toUserId
      ? `assigneeId|${message.toUserId}`
      : undefined;

    // section inbox
    gsiSectionBox = message.toSection
      ? `section|${message.toSection}`
      : undefined;
  }

  await put({
    Item: {
      ...message,
      gsi1pk: `message|${message.parentMessageId}`,
      gsiSectionBox,
      gsiUserBox,
      pk: `case|${message.docketNumber}`,
      sk: `message|${message.messageId}`,
    },
    applicationContext,
  });
};

const putMessageInOutbox = async ({
  applicationContext,
  message,
}: {
  applicationContext: IApplicationContext;
  message: RawMessage;
}): Promise<void> => {
  const sk = message.completedAt ? message.completedAt : message.createdAt;
  const ttl = calculateTimeToLive({
    numDays: 8,
    timestamp: message.createdAt,
  });
  const box = message.completedAt ? 'completed' : 'outbox';
  const buckets = [
    {
      bucket: 'user',
      identifier: message.completedAt
        ? message.completedByUserId
        : message.fromUserId,
    },
    {
      bucket: 'section',
      identifier: message.completedAt
        ? message.completedBySection
        : message.fromSection,
    },
  ];

  await Promise.all(
    buckets.map(({ bucket, identifier }) =>
      put({
        Item: {
          ...message,
          pk: `message|${box}|${bucket}|${identifier}`,
          sk,
          ttl: ttl.expirationTimestamp,
        },
        applicationContext,
      }),
    ),
  );
};
