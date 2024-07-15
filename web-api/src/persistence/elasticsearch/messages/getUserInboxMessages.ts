import { Message } from '@shared/business/entities/Message';
import { and, eq, gt } from 'drizzle-orm';
import { db } from '@web-api/db';
import { messagesTable } from '@web-api/db/schema';

export const getUserInboxMessages = async ({ applicationContext, userId }) => {
  applicationContext.logger.info('getUserInboxMessages start');

  const messages = await db.query.messagesTable.findMany({
    where: and(
      eq(messagesTable.toUserId, userId),
      eq(messagesTable.isRepliedTo, false),
      gt(messagesTable.isCompleted, false),
    ),
  });

  console.log('HERE', messages);

  return messages.map(
    result =>
      new Message(
        {
          ...result,
          completedAt: result.completedAt?.toISOString(),
          createdAt: result.createdAt?.toISOString(),
        },
        { applicationContext },
      ),
  );
};
