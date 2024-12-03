import { getDbWriter } from '../../../../database';
import { messages } from './fixtures/messages';
import { workItems } from './fixtures/workItems';

export const seed = async () => {
  await getDbWriter(writer =>
    writer
      .insertInto('dwMessage')
      .values(messages)
      .onConflict(oc => oc.column('messageId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );

  await getDbWriter(writer =>
    writer
      .insertInto('dwWorkItem')
      .values(workItems)
      .onConflict(oc => oc.column('workItemId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );
};

seed().catch;
