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
    .selectFrom('message')
    .leftJoin('case', 'case.docketNumber', 'message.docketNumber')
    .where('isCompleted', '=', false)
    .where('isRepliedTo', '=', false)
    .where('toUserId', '=', userId)
    .selectAll()
    .select(['message.docketNumber as docketNumber']) // required to ensure docketNumber exists even if not in case
    .execute();

  console.log('**** messages', messages);

  applicationContext.logger.info('getUserInboxMessages end');

  return messages.map(message =>
    new MessageResult(transformNullToUndefined(message), {
      applicationContext,
    }).validate(),
  );
};
