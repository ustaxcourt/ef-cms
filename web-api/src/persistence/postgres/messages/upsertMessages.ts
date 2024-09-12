import { RawMessage } from '@shared/business/entities/Message';
import { getDbWriter } from '@web-api/database';
import { toKyselyNewMessages, toKyselyUpdateMessage } from './mapper';

export const upsertMessages = async (messages: RawMessage[]) => {
  if (messages.length === 0) return;

  await getDbWriter(writer =>
    writer
      .insertInto('message')
      .values(toKyselyNewMessages(messages))
      .onConflict(oc =>
        oc.column('messageId').doUpdateSet(c => {
          const keys = Object.keys(messages[0]!) as any[];
          return toKyselyUpdateMessage(
            Object.fromEntries(keys.map(key => [key, c.ref(key)])),
          );
        }),
      )
      .execute(),
  );
};
