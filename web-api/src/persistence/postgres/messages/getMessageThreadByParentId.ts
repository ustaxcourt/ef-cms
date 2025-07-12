import { Message } from '@shared/business/entities/Message';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { messageResultEntity } from '@web-api/persistence/postgres/messages/mapper';

export const getMessageThreadByParentId = async ({
  parentMessageId,
}: {
  parentMessageId: string;
}): Promise<Message[]> => {
  const messages = await getDbReader(reader =>
    reader
      .selectFrom('dwMessage as m')
      .leftJoin('dwCase as c', 'c.docketNumber', 'm.docketNumber')
      .where('m.parentMessageId', '=', parentMessageId)
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
