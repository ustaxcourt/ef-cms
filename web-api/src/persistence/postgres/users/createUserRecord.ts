import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { toKyselyNewUser } from './mapper';

// TODO: 10495 Delete this file
export const createUserRecord = async ({
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
    values: toKyselyNewUser(user),
    onConflictColumns: ['userId'],
  });

  return {
    ...user,
    userId,
  };
};
