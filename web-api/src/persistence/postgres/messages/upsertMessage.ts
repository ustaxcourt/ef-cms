import { RawMessage } from '@shared/business/entities/Message';
import { db } from '@web-api/database';
import { toKyselyNewMessage, toKyselyUpdateMessage } from './mapper';

export const upsertMessage = async ({ message }: { message: RawMessage }) => {
  await db
    .insertInto('message')
    .values(toKyselyNewMessage(message))
    .onConflict(oc =>
      oc.column('docketNumber').doUpdateSet(toKyselyUpdateMessage(message)),
    )
    .execute();
};
