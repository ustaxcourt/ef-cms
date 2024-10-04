import { MessageResult } from '@shared/business/entities/MessageResult';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { messageResultEntity } from '@web-api/persistence/postgres/messages/mapper';

export const getUserOutboxMessages = async ({
  userId,
}: {
  userId: string;
}): Promise<MessageResult[]> => {
  const filterDate = calculateDate({ howMuch: -7 });

  const messages = await getDbReader(reader =>
    reader
      .selectFrom('dwMessage as m')
      .leftJoin('dwCase as c', 'c.docketNumber', 'm.docketNumber')
      .where('m.fromUserId', '=', userId)
      .where('m.createdAt', '>=', filterDate)
      .selectAll()
      .select('m.docketNumber')
      .limit(5000)
      .execute(),
  );

  return messages.map(message => messageResultEntity(message));
};
