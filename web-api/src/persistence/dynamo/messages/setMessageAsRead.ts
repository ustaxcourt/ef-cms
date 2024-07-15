import { db } from '@web-api/db';
import { eq } from 'drizzle-orm';
import { messagesTable } from '@web-api/db/schema';

export const setMessageAsRead = ({
  applicationContext,
  docketNumber,
  messageId,
}: {
  applicationContext: IApplicationContext;
  messageId: string;
  docketNumber: string;
}) =>
  db
    .update(messagesTable)
    .set({
      isRead: true,
    })
    .where(eq(messagesTable.messageId, messageId));
