import { RawMessage } from '@shared/business/entities/Message';
import { db } from '@web-api/db';
import { eq } from 'drizzle-orm';
import { messagesTable } from '@web-api/db/schema';

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
  db
    .update(messagesTable)
    .set({
      ...message,
      createdAt: new Date(message.createdAt),
    })
    .where(eq(messagesTable.messageId, message.messageId));
