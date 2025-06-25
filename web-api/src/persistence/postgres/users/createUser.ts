import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { toKyselyNewUser } from '@web-api/persistence/postgres/users/mapper';

export const createUser = async ({
  user,
  userId,
}: {
  user: any;
  userId: string;
}) => {
  delete user.password;

  if (user.barNumber === '') {
    delete user.barNumber;
  }

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
