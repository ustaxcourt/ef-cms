import { RawMessage } from '@shared/business/entities/Message';
import { getDbWriter } from '@web-api/database';
import { toKyselyNewMessage, toKyselyUpdateMessage } from './mapper';

export const upsertMessage = async (message: RawMessage) => {
  await getDbWriter(writer =>
    writer
      .insertInto('message')
      .values(toKyselyNewMessage(message))
      .onConflict(oc =>
        oc.column('messageId').doUpdateSet(toKyselyUpdateMessage(message)),
      )
      .execute(),
  );
};
