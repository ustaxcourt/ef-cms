import { Message } from '@shared/business/entities/Message';
import { db } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

/**
 * getMessageThreadByParentId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.parentMessageId the id of the parent message
 * @returns {object} the created message
 */
export const getMessageThreadByParentId = async ({
  applicationContext,
  parentMessageId,
}: {
  applicationContext: IApplicationContext;
  parentMessageId: string;
}) => {
  const messages = await db
    .selectFrom('message')
    .where('parentMessageId', '=', parentMessageId)
    .selectAll()
    .execute();

  return messages.map(
    result =>
      new Message(
        transformNullToUndefined({ ...result, createdAt: result.createdAt }),
        { applicationContext },
      ),
  );
};
