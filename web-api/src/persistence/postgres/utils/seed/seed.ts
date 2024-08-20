import { dbWrite } from '../../../../database';
import { messages } from './fixtures/messages';

export const seed = async () => {
  await dbWrite
    .insertInto('message')
    .values(messages)
    .onConflict(oc => oc.column('messageId').doNothing()) // ensure doesn't fail if exists
    .execute();
};

seed().catch;
