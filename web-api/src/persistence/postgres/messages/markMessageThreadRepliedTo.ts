import { dbWrite } from '@web-api/database';
import { getMessageThreadByParentId } from './getMessageThreadByParentId';

export const markMessageThreadRepliedTo = async ({
  parentMessageId,
}: {
  parentMessageId: string;
}): Promise<void> => {
  const messages = await getMessageThreadByParentId({
    parentMessageId,
  });

  if (messages.length) {
    await Promise.all(
      messages.map(async message => {
        await dbWrite
          .updateTable('message')
          .set({
            isRepliedTo: true,
          })
          .where('messageId', '=', message.messageId)
          .execute();
      }),
    );
  }
};
