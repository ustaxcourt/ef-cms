import { MessageResult } from '@shared/business/entities/MessageResult';
import { db } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

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
}): Promise<MessageResult[]> => {
  const messages = await db
    .selectFrom('message as m')
    .leftJoin('case as c', 'c.docketNumber', 'm.docketNumber')
    .where('m.docketNumber', '=', docketNumber)
    .selectAll('m')
    .select(['m.docketNumber'])
    .execute();

  return messages.map(message =>
    new MessageResult(transformNullToUndefined(message), {
      applicationContext,
    }).validate(),
  );
};
