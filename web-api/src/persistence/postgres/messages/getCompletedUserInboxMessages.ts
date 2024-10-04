import { Message } from '@shared/business/entities/Message';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { messageResultEntity } from '@web-api/persistence/postgres/messages/mapper';

export const getCompletedUserInboxMessages = async ({
  userId,
}: {
  userId: string;
}): Promise<Message[]> => {
  const filterDate = calculateDate({ howMuch: -7 });

  const messages = await getDbReader(reader =>
    reader
      .selectFrom('dwMessage as m')
      .leftJoin('dwCase as c', 'c.docketNumber', 'm.docketNumber')
      .where('m.completedByUserId', '=', userId)
      .where('m.isCompleted', '=', true)
      .where('m.completedAt', '>=', filterDate)
      .selectAll()
      .select('m.docketNumber')
      .limit(5000)
      .execute(),
  );

  return messages.map(message => messageResultEntity(message));
};
