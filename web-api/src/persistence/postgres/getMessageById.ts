import { Message } from '@web-api/persistence/repository/Message';
import { getDataSource } from '@web-api/data-source';

/**
 * getMessageById
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the message
 * @param {string} providers.messageId the id of the message
 * @returns {object} the message
 */
export const getMessageById = async ({
  applicationContext,
  docketNumber,
  messageId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  messageId: string;
}) => {
  const appDataSource = await getDataSource();
  const messageRepository = appDataSource.getRepository(Message);
  const message = await messageRepository.findOne({
    where: { messageId },
  });

  return message;
};
