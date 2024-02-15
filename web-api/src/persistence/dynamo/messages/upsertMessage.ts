import { RawMessage } from '@shared/business/entities/Message';
import { put } from '../../dynamodbClientService';

export const upsertMessage = ({
  applicationContext,
  message,
}: {
  applicationContext: IApplicationContext;
  message: RawMessage;
}) =>
  put({
    Item: {
      ...message,
      gsi1pk: `message|${message.parentMessageId}`,
      gsi2pk:
        !message.completedAt && message.toUserId
          ? `assigneeId|inbox|${message.toUserId}`
          : undefined,
      gsi3pk: message.fromUserId
        ? `assigneeId|${message.completedAt ? 'completed' : 'outbox'}|${message.fromUserId}`
        : undefined,
      gsi4pk:
        !message.completedAt && message.toSection
          ? `section|inbox|${message.toSection}`
          : undefined,
      gsi5pk: message.fromSection
        ? `section|${message.completedAt ? 'completed' : 'outbox'}|${message.fromSection}`
        : undefined,
      pk: `case|${message.docketNumber}`,
      sk: `message|${message.messageId}`,
    },
    applicationContext, // section|outbox|docket .... // assigneeId|inbox|<USERID>
  });
