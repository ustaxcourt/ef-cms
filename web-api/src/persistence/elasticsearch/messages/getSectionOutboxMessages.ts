import { Message } from '@shared/business/entities/Message';
import { and, eq, gt } from 'drizzle-orm';
import { calculateISODate } from '../../../../../shared/src/business/utilities/DateHandler';
import { db } from '@web-api/db';
import { messagesTable } from '@web-api/db/schema';

export const getSectionOutboxMessages = async ({
  applicationContext,
  section,
}) => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const messages = await db.query.messagesTable.findMany({
    where: and(
      eq(messagesTable.fromSection, section),
      gt(messagesTable.createdAt, new Date(filterDate)),
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
