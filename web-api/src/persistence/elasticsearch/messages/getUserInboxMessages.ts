import { AppDataSource } from '@web-api/data-source';
import { Message } from '@shared/business/entities/Message';
import { Message as messageRepo } from '@web-api/persistence/repository/Message';

export const getUserInboxMessages = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) => {
  applicationContext.logger.info('getUserInboxMessages start');

  const messageRepository = AppDataSource.getRepository(messageRepo);

  const messages = await messageRepository.find({
    take: 5000,
    where: {
      isCompleted: false,
      isRepliedTo: false,
      toUserId: userId,
    },
  });

  applicationContext.logger.info('getUserInboxMessages end');

  console.log('messages', messages);

  return messages.map(
    message =>
      new Message(
        {
          ...message,
          leadDocketNumber:
            message.leadDocketNumber === null
              ? undefined
              : message.leadDocketNumber,
        },
        { applicationContext },
      ),
  );
};
