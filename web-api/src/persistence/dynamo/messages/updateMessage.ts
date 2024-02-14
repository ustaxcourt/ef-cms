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
}) => {
  let gsi2pk;
  if (message.toUserId) {
    gsi2pk = `assigneeId|${message.toUserId}`;
    if (message.completedAt) {
      gsi2pk += '|completed';
    } else if (message.isRepliedTo) {
      gsi2pk += '|outbox';
    } else {
      gsi2pk += '|inbox';
    }
  }

  return put({
    Item: {
      ...message,
      gsi1pk: `message|${message.parentMessageId}`,
      gsi2pk,
      gsi3pk:
        !message.completedAt && message.toSection
          ? `section|${message.toSection}`
          : undefined,
      pk: `case|${message.docketNumber}`,
      sk: `message|${message.messageId}`,
    },
    applicationContext,
  });
};
