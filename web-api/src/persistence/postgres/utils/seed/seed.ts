import { db } from '../../../../database';
import { messages } from './fixtures/messages';

export const seed = async () => {
  await db
    .insertInto('message')
    .values(messages)
    .onConflict(oc => oc.column('messageId').doNothing()) // ensure doesn't fail if exists
    .execute();
};

seed().catch;
