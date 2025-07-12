import { MessageResult } from '@shared/business/entities/MessageResult';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { messageResultEntity } from '@web-api/persistence/postgres/messages/mapper';

export const getUserInboxMessages = async ({
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<MessageResult[]> => {
  const messages = await getDbReader(reader =>
    reader
      .selectFrom('dwMessage as m')
      .leftJoin('dwCase as c', 'c.docketNumber', 'm.docketNumber')
      .where('m.isCompleted', '=', false)
      .where('m.isRepliedTo', '=', false)
      .where('m.toUserId', '=', userId)
      .selectAll('m')
      .select([
        'c.status',
        'c.trialDate',
        'c.trialLocation',
        'c.docketNumberSuffix',
        'c.leadDocketNumber',
        'c.caption',
      ])
      .execute(),
  );

  return messages.map(message => messageResultEntity(message));
};
