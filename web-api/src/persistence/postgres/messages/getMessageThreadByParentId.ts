import { Message } from '@shared/business/entities/Message';
import { getDbReader } from '@web-api/database';
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
      .selectAll()
      .select('m.docketNumber')
      .execute(),
  );

  return messages.map(message => messageResultEntity(message));
};
