import { Message, RawMessage } from '@shared/business/entities/Message';
import { getDbWriter } from '@web-api/database';
import { toKyselyUpdateMessage } from './mapper';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';

export const updateMessage = async ({
  message,
}: {
  message: RawMessage;
}): Promise<Message> => {
  const updatedMessage = await getDbWriter(writer =>
    writer
      .updateTable('message')
      .set(toKyselyUpdateMessage(message))
      .where('messageId', '=', message.messageId)
      .returningAll()
      .executeTakeFirst(),
  );

  if (!updatedMessage) {
    throw new Error('could not update the message');
  }

  return new Message(transformNullToUndefined(message));
};
