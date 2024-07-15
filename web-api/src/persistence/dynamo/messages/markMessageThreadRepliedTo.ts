import { AppDataSource } from '@web-api/data-source';
import { Message } from '@web-api/persistence/repository/Message';
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
    const messageRepository = AppDataSource.getRepository(Message);

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
