import { Message } from '@shared/business/entities/Message';
import { and, eq } from 'drizzle-orm';
import { db } from '@web-api/db';
import { messagesTable } from '@web-api/db/schema';

/**
 * getMessagesByDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the created message
 */
export const getMessagesByDocketNumber = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}) => {
  const messages = await db.query.messagesTable.findMany({
    where: and(eq(messagesTable.docketNumber, docketNumber)),
  });

  return messages.map(
    result =>
      new Message(
        { ...result, createdAt: result.createdAt?.toISOString() },
        { applicationContext },
      ),
  );
};
