import { RawMessage } from '@shared/business/entities/Message';
import { db } from '@web-api/database';
import { omit } from 'lodash';

/**
 * createMessage
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message data
 * @returns {object} the created message
 */
export const createMessage = async ({
  applicationContext,
  message,
}: {
  applicationContext: IApplicationContext;
  message: RawMessage;
}) => {
  return await db
    .insertInto('message')
    .values({
      ...omit(message, 'entityName'),
      attachments: JSON.stringify(message.attachments),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};
