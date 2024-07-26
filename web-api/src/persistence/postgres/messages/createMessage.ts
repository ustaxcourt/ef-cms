import { RawMessage } from '@shared/business/entities/Message';
import { db } from '@web-api/database';
import { toKyselyNewMessage } from './mapper';

export const createMessage = async ({
  message,
}: {
  message: RawMessage;
}): Promise<RawMessage> => {
  return (await db
    .insertInto('message')
    .values(toKyselyNewMessage(message))
    .returningAll()
    .executeTakeFirst()) as RawMessage;
};
