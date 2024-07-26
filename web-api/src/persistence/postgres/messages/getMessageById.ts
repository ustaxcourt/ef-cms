import { Message } from '@shared/business/entities/Message';
import { db } from '@web-api/database';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';

export const getMessageById = async ({
  messageId,
}: {
  messageId: string;
}): Promise<Message> => {
  const message = await db
    .selectFrom('message')
    .where('messageId', '=', messageId)
    .selectAll()
    .executeTakeFirst();

  return new Message(transformNullToUndefined({ ...message })).validate();
};
