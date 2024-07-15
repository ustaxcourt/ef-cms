import { AppDataSource } from '@web-api/data-source';
import { Message } from '@shared/business/entities/Message';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { Message as messageRepo } from '@web-api/persistence/repository/Message';

export const getCompletedUserInboxMessages = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const messageRepository = AppDataSource.getRepository(messageRepo);

  const messages = await messageRepository
    .createQueryBuilder('message')
    .where('message.completedByUserId = :userId', { userId })
    .andWhere('message.isCompleted = :isCompleted', { isCompleted: true })
    .andWhere('message.completedAt >= :filterDate', { filterDate })
    .limit(5000)
    .getMany();

  return messages.map(
    message => new Message({ ...message }, { applicationContext }),
  );
};
