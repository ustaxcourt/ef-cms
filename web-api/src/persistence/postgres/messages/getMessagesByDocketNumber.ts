import { MessageResult } from '@shared/business/entities/MessageResult';
import { dbRead } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getMessagesByDocketNumber = async ({
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}): Promise<MessageResult[]> => {
  const messages = await dbRead
    .selectFrom('message as m')
    .leftJoin('case as c', 'c.docketNumber', 'm.docketNumber')
    .where('m.docketNumber', '=', docketNumber)
    .selectAll()
    .select('m.docketNumber')
    .execute();

  return messages.map(message =>
    new MessageResult(transformNullToUndefined(message)).validate(),
  );
};
