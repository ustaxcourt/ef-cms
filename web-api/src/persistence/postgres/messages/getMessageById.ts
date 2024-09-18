import { Message } from '@shared/business/entities/Message';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';

export const getMessageById = async ({
  messageId,
}: {
  messageId: string;
}): Promise<Message> => {
  const message = await getDbReader(reader =>
    reader
      .selectFrom('message')
      .where('messageId', '=', messageId)
      .selectAll()
      .executeTakeFirst(),
  );

  return new Message(transformNullToUndefined({ ...message }));
};
