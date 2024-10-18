import { getDbWriter } from '@web-api/database';

export const setMessageAsRead = async ({
  messageId,
}: {
  messageId: string;
}): Promise<void> => {
  await getDbWriter(writer =>
    writer
      .updateTable('dwMessage')
      .set({
        isRead: true,
      })
      .where('messageId', '=', messageId)
      .execute(),
  );
};
