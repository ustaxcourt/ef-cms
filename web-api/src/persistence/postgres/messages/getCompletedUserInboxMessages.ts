import { Message } from '@shared/business/entities/Message';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { fromKyselyMessage } from '@web-api/persistence/postgres/messages/mapper';

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
      .selectAll('m')
      .select([
        'c.status',
        'c.trialDate',
        'c.trialLocation',
        'c.docketNumberSuffix',
        'c.leadDocketNumber',
        'c.caption',
      ])
      .limit(5000)
      .execute(),
  );

  return messages.map(message => fromKyselyMessage(message));
};
