import { Message } from '@shared/business/entities/Message';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { dbRead } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getCompletedSectionInboxMessages = async ({
  section,
}: {
  section: string;
}): Promise<Message[]> => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const messages = await dbRead(reader =>
    reader
      .selectFrom('message')
      .where('completedBySection', '=', section)
      .where('isCompleted', '=', true)
      .where('createdAt', '>=', filterDate)
      .selectAll()
      .limit(5000)
      .execute(),
  );

  return messages.map(message =>
    new Message(transformNullToUndefined(message)).validate(),
  );
};
