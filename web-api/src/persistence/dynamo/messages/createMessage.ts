import { RawMessage } from '@shared/business/entities/Message';
import { db } from '@web-api/db';
import { messagesTable } from '@web-api/db/schema';
import { put } from '../../dynamodbClientService';

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
  await db
    .insert(messagesTable)
    .values({ ...message, createdAt: new Date(message.createdAt) });
};
