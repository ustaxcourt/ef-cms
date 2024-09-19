import { MessageResult } from '@shared/business/entities/MessageResult';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getMessagesByDocketNumber = async ({
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}): Promise<MessageResult[]> => {
  const messages = await getDbReader(reader =>
    reader
      .selectFrom('message as m')
      .leftJoin('case as c', 'c.docketNumber', 'm.docketNumber')
      .where('m.docketNumber', '=', docketNumber)
      .selectAll()
      .select('m.docketNumber')
      .execute(),
  );

  return messages.map(
    message => new MessageResult(transformNullToUndefined(message)),
  );
};
