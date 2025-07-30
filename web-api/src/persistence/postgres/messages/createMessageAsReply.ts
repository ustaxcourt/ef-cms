import { Message, RawMessage } from '@shared/business/entities/Message';
import { getDbWriter } from '@web-api/persistence/postgres/database';
import { getMessageThreadByParentId } from '@web-api/persistence/postgres/messages/getMessageThreadByParentId';
import { toKyselyNewMessage } from './mapper';
import { OPENSEARCH_SYNC_ACTIONS } from '@web-api/lambdas/openSearch/openSearchSyncHandler';

export const createMessageAsReply = async ({
  newMessage,
  parentMessageId,
}: {
  parentMessageId: string;
  newMessage: RawMessage;
}): Promise<RawMessage> => {
  const messages = await getMessageThreadByParentId({
    parentMessageId,
  });

  const createdMessage = await getDbWriter({
    cb: async writer =>
      await writer.transaction().execute(async trx => {
        if (messages?.length) {
          await trx
            .updateTable('dwMessage')
            .set({
              isRepliedTo: true,
            })
            .where('parentMessageId', '=', parentMessageId)
            .execute();
        }

        return await trx
          .insertInto('dwMessage')
          .values(toKyselyNewMessage(newMessage))
          .returningAll()
          .executeTakeFirstOrThrow(() => {
            throw new Error('could not create a message');
          });
      }),
    table: null,
    action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
  });

  return new Message(createdMessage);
};
