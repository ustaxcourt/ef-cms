import { AppDataSource } from '@web-api/data-source';
import { Message } from '@web-api/persistence/repository/Message';

/**
 * getMessagesByDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the messages
 */
export const getMessagesByDocketNumber = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}) => {
  const messageRepository = AppDataSource.getRepository(Message);

  const results = await messageRepository
    .createQueryBuilder('message')
    .where('message.docketNumber = :docketNumber', { docketNumber })
    .getMany();

  return results;
};
