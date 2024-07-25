import { RawMessage } from '@shared/business/entities/Message';
import { db } from '@web-api/database';
import { omit } from 'lodash';

export const createMessage = async ({
  message,
}: {
  message: RawMessage;
}): Promise<RawMessage> => {
  return (await db
    .insertInto('message')
    .values({
      ...omit(message, ['entityName', 'docketNumberWithSuffix']),
      attachments: JSON.stringify(message.attachments),
    })
    .returningAll()
    .executeTakeFirst()) as RawMessage;
};
