import { RawMessage } from '@shared/business/entities/Message';
import { put } from '../../dynamodbClientService';

/**
 * updateMessage
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message data
 * @returns {object} the created message
 */
export const updateMessage = ({
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
        message.toUserId && !message.completedAt
          ? `assigneeId|${message.toUserId}`
          : undefined,
      gsi3pk:
        !message.completedAt && message.toSection
          ? `section|${message.toSection}`
          : undefined,
      pk: `case|${message.docketNumber}`,
      sk: `message|${message.messageId}`,
    },
    applicationContext,
  });
