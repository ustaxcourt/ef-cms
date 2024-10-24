import { MessageResult } from '@shared/business/entities/MessageResult';
import { getDbReader } from '@web-api/database';
import { messageResultEntity } from '@web-api/persistence/postgres/messages/mapper';

export const getMessagesByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<MessageResult[]> => {
  const messages = await getDbReader(reader =>
    reader
      .selectFrom('dwMessage as m')
      .leftJoin('dwCase as c', 'c.docketNumber', 'm.docketNumber')
      .where('m.docketNumber', '=', docketNumber)
      .selectAll()
      .select('m.docketNumber')
      .execute(),
  );

  console.log('*** messages', messages);

  return messages.map(message => messageResultEntity(message));
};
