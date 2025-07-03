import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { toKyselyNewUser } from '@web-api/persistence/postgres/users/mapper';
import { RawUser } from '@shared/business/entities/User';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';

export const upsertUsers = async (
  users: (RawUser | RawPractitioner | RawIrsPractitioner)[],
): Promise<void> => {
  await pgInsertInto({
    table: 'dwUser',
    values: users.map(user => toKyselyNewUser(user)),
    onConflictColumns: ['userId'],
  });
};
