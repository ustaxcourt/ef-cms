import { db } from '@web-api/database';

export const setMessageAsRead = async ({
  messageId,
}: {
  messageId: string;
}): Promise<void> => {
  await db
    .updateTable('message')
    .set({
      isRead: true,
    })
    .where('messageId', '=', messageId)
    .execute();
};
