import { AppDataSource } from '@web-api/data-source';
import { Message } from '@web-api/persistence/repository/Message';
import { calculateISODate } from '@shared/business/utilities/DateHandler';

export const getSectionOutboxMessages = async ({
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
    .where('message.fromSection = :section', { section })
    .andWhere('message.createdAt >= :filterDate', { filterDate })
    .limit(5000)
    .getMany();

  return results;
};
