import { AppDataSource } from '@web-api/data-source';
import { Message } from '@shared/business/entities/Message';
import { Message as messageRepo } from '@web-api/persistence/repository/Message';

export const getSectionInboxMessages = async ({
  applicationContext,
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}) => {
  applicationContext.logger.info('getSectionInboxMessages start');

  const messageRepository = AppDataSource.getRepository(messageRepo);

  const messages = await messageRepository
    .createQueryBuilder('message')
    .where('message.toSection = :section', { section })
    .andWhere('message.isRepliedTo = :isRepliedTo', { isRepliedTo: false })
    .andWhere('message.isCompleted = :isCompleted', { isCompleted: false })
    .limit(5000)
    .getMany();

  applicationContext.logger.info('getSectionInboxMessages end');

  return messages.map(
    message => new Message({ ...message }, { applicationContext }),
  );
};
