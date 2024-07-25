import { db } from '@web-api/database';

export const getMessageById = async ({ messageId }: { messageId: string }) => {
  const message = await db
    .selectFrom('message')
    .where('messageId', '=', messageId)
    .selectAll()
    .executeTakeFirst();

  return message;
};
