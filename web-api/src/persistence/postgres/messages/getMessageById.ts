import { Message } from '@shared/business/entities/Message';
import { getDbReader } from '@web-api/database';
import { messageResultEntity } from '@web-api/persistence/postgres/messages/mapper';

export const getMessageById = async ({
  messageId,
}: {
  messageId: string;
}): Promise<Message> => {
  const message = await getDbReader(reader =>
    reader
      .selectFrom('dwMessage as m')
      .leftJoin('dwCase as c', 'c.docketNumber', 'm.docketNumber')
      .where('messageId', '=', messageId)
      .selectAll('m')
      .select([
        'c.status',
        'c.trialDate',
        'c.trialLocation',
        'c.docketNumberSuffix',
        'c.leadDocketNumber',
        'c.caption',
      ])
      .executeTakeFirst(),
  );

  return messageResultEntity(message);
};
