import { MessageResult } from '@shared/business/entities/MessageResult';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { messageResultEntity } from '@web-api/persistence/postgres/messages/mapper';

export const getSectionOutboxMessages = async ({
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}): Promise<MessageResult[]> => {
  const filterDate = calculateDate({ howMuch: -7 });

  const messages = await getDbReader(reader =>
    reader
      .selectFrom('message as m')
      .leftJoin('case as c', 'c.docketNumber', 'm.docketNumber')
      .where('m.fromSection', '=', section)
      .where('m.createdAt', '>=', filterDate)
      .selectAll()
      .select('m.docketNumber')
      .execute(),
  );

  return messages.map(message => messageResultEntity(message));
};
