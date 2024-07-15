import { Message } from '@shared/business/entities/Message';
import { and, eq } from 'drizzle-orm';
import { db } from '@web-api/db';
import { messagesTable } from '@web-api/db/schema';

/**
 * getMessageThreadByParentId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.parentMessageId the id of the parent message
 * @returns {object} the created message
 */
export const getMessageThreadByParentId = async ({
  applicationContext,
  parentMessageId,
}: {
  applicationContext: IApplicationContext;
  parentMessageId: string;
}) => {
  const messages = await db.query.messagesTable.findMany({
    where: and(eq(messagesTable.parentMessageId, parentMessageId)),
  });

  return messages.map(
    result =>
      new Message(
        { ...result, createdAt: result.createdAt?.toISOString() },
        { applicationContext },
      ),
  );
};
