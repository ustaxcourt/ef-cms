import { MessageResult } from '@shared/business/entities/MessageResult';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { dbRead } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getUserOutboxMessages = async ({
  userId,
}: {
  userId: string;
}): Promise<MessageResult[]> => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const messages = await dbRead
    .selectFrom('message as m')
    .leftJoin('case as c', 'c.docketNumber', 'm.docketNumber')
    .where('m.fromUserId', '=', userId)
    .where('m.createdAt', '>=', filterDate)
    .selectAll()
    .select('m.docketNumber')
    .limit(5000)
    .execute();

  return messages.map(message =>
    new MessageResult(transformNullToUndefined(message)).validate(),
  );
};
