import { UserContactKysely } from '@web-api/persistence/postgres/userContact/schema';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertUserContacts = async (
  userContacts: UserContactKysely[],
): Promise<void> => {
  await pgInsertInto({
    table: 'dwUserContact',
    values: userContacts,
    onConflictColumns: ['userId', 'docketNumber'],
  });
};
