import { settlePromises } from '@web-api/utilities/settlePromises';
import { getMessageThreadByParentId } from './getMessageThreadByParentId';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';
import { withTransaction } from '@web-api/persistence/postgres/utils/transactions';

export const markMessageThreadRepliedTo = async ({
  parentMessageId,
}: {
  parentMessageId: string;
}): Promise<void> => {
  const messages = await getMessageThreadByParentId({
    parentMessageId,
  });

  if (messages.length) {
    await withTransaction(async () => {
      await settlePromises(
        messages.map(async message => {
          await pgUpdateTable({
            table: 'dwMessage',
            values: { isRepliedTo: true },
            where: cb => cb.where('messageId', '=', message.messageId),
          });
        }),
      );
    });
  }
};
