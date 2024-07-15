import { Message } from '@shared/business/entities/Message';
import { and, eq, gte } from 'drizzle-orm';
import { calculateISODate } from '../../../../../shared/src/business/utilities/DateHandler';
import { db } from '@web-api/db';
import { messagesTable } from '@web-api/db/schema';

export const getUserOutboxMessages = async ({ applicationContext, userId }) => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const messages = await db.query.messagesTable.findMany({
    where: and(
      eq(messagesTable.fromUserId, userId),
      gte(messagesTable.createdAt, new Date(filterDate)),
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
