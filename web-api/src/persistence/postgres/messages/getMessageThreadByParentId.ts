import { Message } from '@shared/business/entities/Message';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getMessageThreadByParentId = async ({
  parentMessageId,
}: {
  parentMessageId: string;
}): Promise<Message[]> => {
  const messages = await getDbReader(reader =>
    reader
      .selectFrom('message')
      .where('parentMessageId', '=', parentMessageId)
      .selectAll()
      .execute(),
  );

  return messages.map(
    result =>
      new Message(
        transformNullToUndefined({ ...result, createdAt: result.createdAt }),
      ),
  );
};
