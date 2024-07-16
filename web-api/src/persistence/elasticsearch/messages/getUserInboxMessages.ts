import { AppDataSource } from '@web-api/data-source';
import { Case } from '@web-api/persistence/repository/Case';
import { MessageResult } from '@shared/business/entities/MessageResult';
import { Message as messageRepo } from '@web-api/persistence/repository/Message';
import { transformNullToUndefined } from 'postgres/helpers/transformNullToUndefined';

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
    relations: { case: true },
    take: 5000,
    where: {
      isCompleted: false,
      isRepliedTo: false,
      toUserId: userId,
    },
  });

  applicationContext.logger.info('getUserInboxMessages end');

  return messages.map(message =>
    new MessageResult(
      transformNullToUndefined({
        ...message,
        // trialDate: message.case?.trialDate,
        // trialLocation: message.case?.trialLocation,
      }),
      {
        applicationContext,
      },
    ).validate(),
  );
};
