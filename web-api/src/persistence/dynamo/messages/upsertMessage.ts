import { RawMessage } from '@shared/business/entities/Message';
import { calculateTimeToLive } from '@web-api/persistence/dynamo/calculateTimeToLive';
import { put } from '../../dynamodbClientService';

export const upsertMessage = async ({
  applicationContext,
  message,
}: {
  applicationContext: IApplicationContext;
  message: RawMessage;
}) => {
  let gsi2pk, gsiSectionBox;

  if (!message.completedAt) {
    await putMessageInOutbox({ applicationContext, message });
    // user inbox
    gsi2pk = message.toUserId ? `assigneeId|${message.toUserId}` : undefined;

    // section inbox
    gsiSectionBox = message.toSection
      ? `section|${message.toSection}`
      : undefined;
  } else {
    await putMessageInCompletedBox({ applicationContext, message });
  }

  return put({
    Item: {
      ...message,
      gsi1pk: `message|${message.parentMessageId}`,
      gsi2pk,
      gsiSectionBox,
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
}) => {
  const sk = message.createdAt;
  const ttl = calculateTimeToLive({
    numDays: 8,
    timestamp: message.createdAt,
  });

  const buckets = [
    { bucket: 'user', identifier: message.fromUserId },
    { bucket: 'section', identifier: message.fromSection },
  ];

  await Promise.all(
    buckets.map(({ bucket, identifier }) =>
      put({
        Item: {
          ...message,
          pk: `message|outbox|${bucket}|${identifier}`,
          sk,
          ttl: ttl.expirationTimestamp,
        },
        applicationContext,
      }),
    ),
  );
};

const putMessageInCompletedBox = async ({
  applicationContext,
  message,
}: {
  applicationContext: IApplicationContext;
  message: RawMessage;
}) => {
  const ttl = calculateTimeToLive({
    numDays: 8,
    timestamp: message.completedAt!,
  });

  const buckets = [
    { bucket: 'user', identifier: message.completedByUserId },
    { bucket: 'section', identifier: message.completedBySection },
  ];

  await Promise.all(
    buckets.map(({ bucket, identifier }) =>
      put({
        Item: {
          ...message,
          pk: `message|completed|${bucket}|${identifier}`,
          sk: message.completedAt!,
          ttl: ttl.expirationTimestamp,
        },
        applicationContext,
      }),
    ),
  );
};
