import { Message } from '@shared/business/entities/Message';
import { and, eq, gt } from 'drizzle-orm';
import { calculateISODate } from '../../../../../shared/src/business/utilities/DateHandler';
import { db } from '@web-api/db';
import { messagesTable } from '@web-api/db/schema';

export const getCompletedUserInboxMessages = async ({
  applicationContext,
  userId,
}) => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const messages = await db.query.messagesTable.findMany({
    where: and(
      eq(messagesTable.completedByUserId, userId),
      eq(messagesTable.isCompleted, true),
      gt(messagesTable.completedAt, new Date(filterDate)),
    ),
  });

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
