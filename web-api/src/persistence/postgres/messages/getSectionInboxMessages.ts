import { Message } from '@shared/business/entities/Message';
import { db } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getSectionInboxMessages = async ({
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}): Promise<Message[]> => {
  const messages = await db
    .selectFrom('message')
    .where('toSection', '=', section)
    .where('isRepliedTo', '=', false)
    .where('isCompleted', '=', false)
    .selectAll()
    .limit(5000)
    .execute();

  return messages.map(message =>
    new Message(transformNullToUndefined(message)).validate(),
  );
};
