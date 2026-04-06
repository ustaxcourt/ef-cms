import { NewUserContactKysely } from '@web-api/persistence/postgres/userContacts/schema';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertUserContacts = async (
  userContacts: NewUserContactKysely[],
): Promise<void> => {
  await pgInsertInto({
    table: 'dwUserContact',
    values: userContacts,
    onConflictColumns: ['userId', 'docketNumber'],
  });
};
