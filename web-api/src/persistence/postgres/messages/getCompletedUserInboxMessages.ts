import { Message } from '@shared/business/entities/Message';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { db } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getCompletedUserInboxMessages = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const messages = await db
    .selectFrom('message')
    .where('completedByUserId', '=', userId)
    .where('isCompleted', '=', true)
    .where('completedAt', '>=', filterDate)
    .selectAll()
    .limit(5000)
    .execute();

  return messages.map(
    message =>
      new Message(transformNullToUndefined(message), { applicationContext }),
  );
};
