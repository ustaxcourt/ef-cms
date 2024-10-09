import { MessageResult } from '@shared/business/entities/MessageResult';
import { getDbReader } from '@web-api/database';
import { messageResultEntity } from '@web-api/persistence/postgres/messages/mapper';

export const getSectionInboxMessages = async ({
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}): Promise<MessageResult[]> => {
  const messages = await getDbReader(reader =>
    reader
      .selectFrom('dwMessage as m')
      .leftJoin('dwCase as c', 'c.docketNumber', 'm.docketNumber')
      .where('m.toSection', '=', section)
      .where('m.isRepliedTo', '=', false)
      .where('m.isCompleted', '=', false)
      .selectAll()
      .select('m.docketNumber')
      .limit(5000)
      .execute(),
  );

  return messages.map(message => messageResultEntity(message));
};
