import { AppDataSource } from '@web-api/data-source';
import { Message } from '@shared/business/entities/Message';
import { Message as messageRepo } from '@web-api/persistence/repository/Message';
import { transformNullToUndefined } from 'postgres/helpers/transformNullToUndefined';

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
  const messageRepository = AppDataSource.getRepository(messageRepo);

  const messages = await messageRepository.find({
    where: {
      parentMessageId,
    },
  });

  return messages.map(
    result =>
      new Message(
        transformNullToUndefined({ ...result, createdAt: result.createdAt }),
        { applicationContext },
      ),
  );
};
