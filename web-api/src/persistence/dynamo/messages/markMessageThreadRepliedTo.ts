import { Message } from '@shared/business/entities/Message';
import { Message } from '@shared/business/entities/Message';
import { and, eq } from 'drizzle-orm';
import { and, eq } from 'drizzle-orm';
import { db } from '@web-api/db';
import { db } from '@web-api/db';
import { getMessageThreadByParentId } from './getMessageThreadByParentId';
import { messagesTable } from '@web-api/db/schema';
import { messagesTable } from '@web-api/db/schema';
import { update } from '../../dynamodbClientService';

/**
 * markMessageThreadRepliedTo
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.messageId the id of the message to update
 * @returns {object} the created message
 */
export const markMessageThreadRepliedTo = async ({
  applicationContext,
  parentMessageId,
}: {
  applicationContext: IApplicationContext;
  parentMessageId: string;
}) => {
  const messages = await getMessageThreadByParentId({
    applicationContext,
    parentMessageId,
  });

  if (messages.length) {
    const updateMessage = async (message: Message) => {
      return await db
        .update(messagesTable)
        .set({
          isRepliedTo: true,
        })
        .where(eq(messagesTable.messageId, message.messageId));
    };

    await Promise.all(messages.map(updateMessage));
  }
};
