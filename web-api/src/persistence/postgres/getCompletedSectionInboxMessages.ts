import { Message } from '@shared/business/entities/Message';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { getDataSource } from '@web-api/data-source';
import { Message as messageRepo } from '@web-api/persistence/repository/Message';
import { transformNullToUndefined } from 'postgres/helpers/transformNullToUndefined';

export const getCompletedSectionInboxMessages = async ({
  applicationContext,
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}) => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const dataSource = await getDataSource();
  const messageRepository = dataSource.getRepository(messageRepo);

  const messages = await messageRepository
    .createQueryBuilder('message')
    .where('message.completedBySection = :section', { section })
    .andWhere('message.isCompleted = :isCompleted', { isCompleted: true })
    .andWhere('message.completedAt >= :filterDate', { filterDate })
    .limit(5000)
    .getMany();

  return messages.map(
    message =>
      new Message(transformNullToUndefined(message), { applicationContext }),
  );
};
