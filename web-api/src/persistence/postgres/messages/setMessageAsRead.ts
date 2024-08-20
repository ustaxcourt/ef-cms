import { dbWrite } from '@web-api/database';

export const setMessageAsRead = async ({
  messageId,
}: {
  messageId: string;
}): Promise<void> => {
  await dbWrite
    .updateTable('message')
    .set({
      isRead: true,
    })
    .where('messageId', '=', messageId)
    .execute();
};
