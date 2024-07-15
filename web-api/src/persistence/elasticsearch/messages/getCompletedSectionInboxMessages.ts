import { AppDataSource } from '@web-api/data-source';
import { Message } from '@web-api/persistence/repository/Message';
import { calculateISODate } from '@shared/business/utilities/DateHandler';

export const getCompletedSectionInboxMessages = async ({
  applicationContext,
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}) => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const messageRepository = AppDataSource.getRepository(Message);

  const results = await messageRepository
    .createQueryBuilder('message')
    .where('message.completedBySection = :section', { section })
    .andWhere('message.isCompleted = :isCompleted', { isCompleted: true })
    .andWhere('message.completedAt >= :filterDate', { filterDate })
    .limit(5000)
    .getMany();

  return results;
};
