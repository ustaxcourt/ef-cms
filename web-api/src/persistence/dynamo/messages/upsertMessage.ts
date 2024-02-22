import { RawMessage } from '@shared/business/entities/Message';
import { put } from '../../dynamodbClientService';

export const upsertMessage = ({
  applicationContext,
  message,
}: {
  applicationContext: IApplicationContext;
  message: RawMessage;
}) => {
  const gsi3pk = message.completedAt
    ? `assigneeId|completed|${message.completedByUserId}`
    : message.fromUserId
      ? `assigneeId|outbox|${message.fromUserId}`
      : undefined;

  const gsi5pk = message.completedAt
    ? `section|${message.completedAt}|${message.completedBySection}`
    : message.fromSection
      ? `section|outbox|${message.fromSection}`
      : undefined;

  return put({
    Item: {
      ...message,
      gsi1pk: `message|${message.parentMessageId}`,
      gsi2pk:
        !message.completedAt && message.toUserId
          ? `assigneeId|inbox|${message.toUserId}`
          : undefined,
      gsi3pk,
      gsi4pk:
        !message.completedAt && message.toSection
          ? `section|inbox|${message.toSection}`
          : undefined,
      gsi5pk,
      pk: `case|${message.docketNumber}`,
      sk: `message|${message.messageId}`,
    },
    applicationContext, // section|outbox|docket .... // assigneeId|inbox|<USERID>
  });
};
