import { MessageResult } from '@shared/business/entities/MessageResult';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getUserInboxMessages = async ({
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<MessageResult[]> => {
  const messages = await getDbReader(reader =>
    reader
      .selectFrom('message as m')
      .leftJoin('case as c', 'c.docketNumber', 'm.docketNumber')
      .where('m.isCompleted', '=', false)
      .where('m.isRepliedTo', '=', false)
      .where('m.toUserId', '=', userId)
      .selectAll()
      .select('m.docketNumber')
      .execute(),
  );

  return messages.map(
    message => new MessageResult(transformNullToUndefined(message)),
  );
};
