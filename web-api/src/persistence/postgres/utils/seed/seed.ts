import { getDbWriter } from '../../../../database';
import { messages } from './fixtures/messages';

export const seed = async () => {
  await getDbWriter(writer =>
    writer
      .insertInto('message')
      .values(messages)
      .onConflict(oc => oc.column('messageId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );
};

seed().catch;
