import { Message, RawMessage } from '@shared/business/entities/Message';
import { getDbWriter } from '@web-api/database';
import { toKyselyNewMessage } from './mapper';

export const createMessage = async ({
  message,
}: {
  message: RawMessage;
}): Promise<RawMessage> => {
  const createdMessage = await getDbWriter(writer =>
    writer
      .insertInto('dwMessage')
      .values(toKyselyNewMessage(message))
      .returningAll()
      .executeTakeFirst(),
  );

  if (!createdMessage) {
    throw new Error('could not create a message');
  }

  return new Message(createdMessage);
};
