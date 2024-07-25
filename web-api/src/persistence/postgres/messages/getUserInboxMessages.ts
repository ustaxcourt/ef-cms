import { MessageResult } from '@shared/business/entities/MessageResult';
import { db } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getUserInboxMessages = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) => {
  applicationContext.logger.info('getUserInboxMessages start');

  const messages = await db
    .selectFrom('message as m')
    .leftJoin('case as c', 'c.docketNumber', 'm.docketNumber')
    .where('m.isCompleted', '=', false)
    .where('m.isRepliedTo', '=', false)
    .where('m.toUserId', '=', userId)
    .selectAll('m')
    .select('m.docketNumber')
    .execute();

  console.log('**** getUserInboxMessages', messages);

  applicationContext.logger.info('getUserInboxMessages end');

  return messages.map(message =>
    new MessageResult(transformNullToUndefined(message), {
      applicationContext,
    }).validate(),
  );
};
