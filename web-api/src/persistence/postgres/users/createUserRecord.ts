import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { toKyselyNewUser } from './mapper';

export const createUserRecord = async ({
  user,
  userId,
}: {
  user: any;
  userId: string;
}) => {
  delete user.password;

  await pgInsertInto({
    table: 'dwUser',
    values: toKyselyNewUser({ ...user, userId }),
    onConflictColumns: ['userId'],
  });

  return {
    ...user,
    userId,
  };
};
