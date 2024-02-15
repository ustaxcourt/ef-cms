import { RawMessage } from '@shared/business/entities/Message';
import { put } from '../../dynamodbClientService';

/**
 * createMessage
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message data
 * @returns {object} the created message
 */
export const createMessage = ({
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
          ? `assigneeId|${message.toUserId}|inbox`
          : undefined,
      gsi3pk: message.fromUserId
        ? `assigneeId|${message.fromUserId}|${message.completedAt ? 'completed' : 'outbox'}`
        : undefined,
      gsi4pk:
        !message.completedAt && message.toSection
          ? `section|${message.toSection}|inbox`
          : undefined,
      gsi5pk: message.fromSection
        ? `section|${message.fromSection}|${message.completedAt ? 'completed' : 'outbox'}`
        : undefined,
      pk: `case|${message.docketNumber}`,
      sk: `message|${message.messageId}`,
    },
    applicationContext,
  });
