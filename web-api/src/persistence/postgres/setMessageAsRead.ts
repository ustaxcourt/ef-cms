import { Message } from '@web-api/persistence/repository/Message';
import { getDataSource } from '@web-api/data-source';

export const setMessageAsRead = async ({
  applicationContext,
  docketNumber,
  messageId,
}: {
  applicationContext: IApplicationContext;
  messageId: string;
  docketNumber: string;
}) => {
  const dataSource = await getDataSource();
  const messageRepository = dataSource.getRepository(Message);

  await messageRepository.update({ docketNumber, messageId }, { isRead: true });
};
