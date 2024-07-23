import { Message } from '@web-api/persistence/repository/Message';
import { RawMessage } from '@shared/business/entities/Message';
import { getDataSource } from '@web-api/data-source';

/**
 * updateMessage
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message data
 * @returns {object} the updated message
 */
export const updateMessage = async ({
  applicationContext,
  message,
}: {
  applicationContext: IApplicationContext;
  message: RawMessage;
}) => {
  const dataSource = await getDataSource();
  const messageRepository = dataSource.getRepository(Message);

  const existingMessage = await messageRepository.findOne({
    where: { messageId: message.messageId },
  });

  if (existingMessage) {
    const updatedMessage = {
      ...existingMessage,
      ...message,
    };

    await messageRepository.save(updatedMessage);

    return updatedMessage;
  } else {
    throw new Error(`Message with id ${message.messageId} not found`);
  }
};
