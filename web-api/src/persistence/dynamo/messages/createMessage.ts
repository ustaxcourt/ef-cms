import { AppDataSource } from '@web-api/data-source';
import { Message } from '@web-api/persistence/repository/Message';
import { RawMessage } from '@shared/business/entities/Message';

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
  const messageRepository = AppDataSource.getRepository(Message);

  return await messageRepository.save({
    ...message,
  });
};
