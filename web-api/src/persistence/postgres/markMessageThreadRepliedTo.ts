import { Message } from '@web-api/persistence/repository/Message';
import { getDataSource } from '@web-api/data-source';
import { getMessageThreadByParentId } from './getMessageThreadByParentId';

/**
 * markMessageThreadRepliedTo
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.parentMessageId the id of the parent message to update
 * @returns {object} the updated messages
 */
export const markMessageThreadRepliedTo = async ({
  applicationContext,
  parentMessageId,
}: {
  applicationContext: IApplicationContext;
  parentMessageId: string;
}) => {
  const messages = await getMessageThreadByParentId({
    applicationContext,
    parentMessageId,
  });

  if (messages.length) {
    const dataSource = await getDataSource();
    const messageRepository = dataSource.getRepository(Message);

    await Promise.all(
      messages.map(async message => {
        await messageRepository.update(
          { messageId: message.messageId },
          { isRepliedTo: true },
        );
      }),
    );
  }
};
