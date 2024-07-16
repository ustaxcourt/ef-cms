import { AppDataSource } from '@web-api/data-source';
import { Message } from '@web-api/persistence/repository/Message';

export const setMessageAsRead = async ({
  applicationContext,
  docketNumber,
  messageId,
}: {
  applicationContext: IApplicationContext;
  messageId: string;
  docketNumber: string;
}) => {
  const messageRepository = AppDataSource.getRepository(Message);

  await messageRepository.update({ docketNumber, messageId }, { isRead: true });
};
