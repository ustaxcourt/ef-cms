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
      .selectFrom('message as m')
      .leftJoin('case as c', 'c.docketNumber', 'm.docketNumber')
      .where('messageId', '=', messageId)
      .selectAll()
      .select('m.docketNumber')
      .executeTakeFirst(),
  );

  return messageResultEntity(message);
};
