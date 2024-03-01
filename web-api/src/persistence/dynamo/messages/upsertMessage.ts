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
  let gsi2pk, gsi3pk, gsi4pk, gsi5pk;

  if (message.completedAt) {
    // save to completed box
    await putMessageInCompletedBox({ applicationContext, message });
  } else {
    // user inbox
    gsi2pk = !message.toUserId
      ? `assigneeId|inbox|${message.toUserId}`
      : undefined;

    // section inbox
    gsi3pk = message.toSection
      ? `section|inbox|${message.toSection}`
      : undefined;

    // user outbox
    gsi4pk = message.fromUserId
      ? `assigneeId|outbox|${message.fromUserId}`
      : undefined;
    gsi5pk = message.fromSection
      ? `section|outbox|${message.fromSection}`
      : undefined;
  }

  return put({
    Item: {
      ...message,
      gsi1pk: `message|${message.parentMessageId}`,
      gsi2pk,
      gsi3pk,
      gsi4pk,
      gsi5pk,
      pk: `case|${message.docketNumber}`,
      sk: `message|${message.messageId}`,
    },
    applicationContext, // section|outbox|docket .... // assigneeId|inbox|<USERID>
  });
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

  await put({
    Item: {
      ...message,
      pk: `user-message-outbox|${message.completedByUserId}`,
      sk: message.completedAt!,
      ttl: ttl.expirationTimestamp,
    },
    applicationContext,
  });

  await put({
    Item: {
      ...message,
      pk: `section-message-outbox|${message.completedBySection}`,
      sk: message.completedAt!,
      ttl: ttl.expirationTimestamp,
    },
    applicationContext,
  });
};
