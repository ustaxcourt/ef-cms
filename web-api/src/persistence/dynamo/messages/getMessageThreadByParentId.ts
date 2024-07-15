import { AppDataSource } from '@web-api/data-source';
import { Message } from '@web-api/persistence/repository/Message';
import { Message as MessageEntity } from '@shared/business/entities/Message';

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
  const messageRepository = AppDataSource.getRepository(Message);

  const messages = await messageRepository.find({
    where: {
      parentMessageId,
    },
  });

  return messages.map(
    result =>
      new MessageEntity(
        { ...result, createdAt: result.createdAt?.toISOString() },
        { applicationContext },
      ),
  );
};
