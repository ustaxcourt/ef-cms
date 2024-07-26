import { RawMessage } from '@shared/business/entities/Message';
import { db } from '@web-api/database';
import { toKyselyUpdateMessage } from './mapper';

export const updateMessage = async ({ message }: { message: RawMessage }) => {
  return await db
    .updateTable('message')
    .set(toKyselyUpdateMessage(message))
    .where('messageId', '=', message.messageId)
    .returningAll()
    .executeTakeFirst();
};
