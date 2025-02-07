import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const setMessageAsRead = async ({
  messageId,
}: {
  messageId: string;
}): Promise<void> => {
  await pgUpdateTable({
    table: 'dwMessage',
    values: { isRead: true },
    where: cb => cb.where('messageId', '=', messageId),
  });
};
