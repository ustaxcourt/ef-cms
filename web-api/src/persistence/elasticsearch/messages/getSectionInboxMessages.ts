import { Message } from '@shared/business/entities/Message';
import { and, eq } from 'drizzle-orm';
import { db } from '@web-api/db';
import { messagesTable } from '@web-api/db/schema';

export const getSectionInboxMessages = async ({
  applicationContext,
  section,
}): Promise<Message[]> => {
  applicationContext.logger.info('getSectionInboxMessages start');

  const messages = await db.query.messagesTable.findMany({
    where: and(
      eq(messagesTable.toSection, section),
      eq(messagesTable.isCompleted, false),
      eq(messagesTable.isRepliedTo, false),
    ),
  });

  return messages.map(
    result =>
      new Message(
        { ...result, createdAt: result.createdAt?.toISOString() },
        { applicationContext },
      ),
  );
};
