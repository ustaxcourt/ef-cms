import { Message } from '@shared/business/entities/Message';
import { getDataSource } from '@web-api/data-source';
import { Message as messageRepo } from '@web-api/persistence/repository/Message';
import { transformNullToUndefined } from 'postgres/helpers/transformNullToUndefined';

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
  const dataSource = await getDataSource();
  const messageRepository = dataSource.getRepository(messageRepo);

  const messages = await messageRepository
    .createQueryBuilder('message')
    .where('message.docketNumber = :docketNumber', { docketNumber })
    .getMany();

  return messages.map(
    message =>
      new Message(transformNullToUndefined(message), { applicationContext }),
  );
};
