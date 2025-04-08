import { RawUser } from '@shared/business/entities/User';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { toKyselyNewUsers } from './mapper';

export const upsertUsers = async (users: RawUser[]) => {
  await pgInsertInto({
    table: 'dwUser',
    values: toKyselyNewUsers(users),
    onConflictColumns: ['userId'],
  });
};
