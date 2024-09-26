import { MessageResult } from '@shared/business/entities/MessageResult';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getSectionInboxMessages = async ({
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}): Promise<MessageResult[]> => {
  const messages = await getDbReader(reader =>
    reader
      .selectFrom('message as m')
      .leftJoin('case as c', 'c.docketNumber', 'm.docketNumber')
      .where('m.toSection', '=', section)
      .where('m.isRepliedTo', '=', false)
      .where('m.isCompleted', '=', false)
      .selectAll()
      .select('m.docketNumber')
      .limit(5000)
      .execute(),
  );

  return messages.map(
    message => new MessageResult(transformNullToUndefined(message)),
  );
};
