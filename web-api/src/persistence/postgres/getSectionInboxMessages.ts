import { Message } from '@shared/business/entities/Message';
import { getDataSource } from '@web-api/data-source';
import { Message as messageRepo } from '@web-api/persistence/repository/Message';
import { transformNullToUndefined } from 'postgres/helpers/transformNullToUndefined';

export const getSectionInboxMessages = async ({
  applicationContext,
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}) => {
  applicationContext.logger.info('getSectionInboxMessages start');

  const dataSource = await getDataSource();
  const messageRepository = dataSource.getRepository(messageRepo);

  const messages = await messageRepository
    .createQueryBuilder('message')
    .where('message.toSection = :section', { section })
    .andWhere('message.isRepliedTo = :isRepliedTo', { isRepliedTo: false })
    .andWhere('message.isCompleted = :isCompleted', { isCompleted: false })
    .limit(5000)
    .getMany();

  applicationContext.logger.info('getSectionInboxMessages end');

  return messages.map(
    message =>
      new Message(transformNullToUndefined(message), { applicationContext }),
  );
};
