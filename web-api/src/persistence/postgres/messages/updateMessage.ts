import { RawMessage } from '@shared/business/entities/Message';
import { db } from '@web-api/database';
import { getMessageById } from '@web-api/persistence/postgres/messages/getMessageById';
import { omit } from 'lodash';

export const updateMessage = async ({ message }: { message: RawMessage }) => {
  const existingMessage = await getMessageById({
    messageId: message.messageId,
  });

  if (existingMessage) {
    const updatedMessage = {
      ...existingMessage,
      ...message,
    };

    return await db
      .updateTable('message')
      .set({
        ...omit(updatedMessage, 'entityName'),
        attachments: JSON.stringify(updatedMessage.attachments),
      })
      .where('messageId', '=', message.messageId)
      .returningAll()
      .executeTakeFirst();
  } else {
    throw new Error(`Message with id ${message.messageId} not found`);
  }
};
