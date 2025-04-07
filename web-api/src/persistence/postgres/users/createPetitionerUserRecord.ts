import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { toKyselyNewUser } from './mapper';

// 10495: This function does not create a cognito user, and it did not in the dynamo implementation either.
export const createPetitionerUserRecord = async ({
  user,
  userId,
}: {
  user: any;
  userId: string;
}) => {
  delete user.password;

  await pgInsertInto({
    table: 'dwUser',
    values: [toKyselyNewUser(user)],
  });

  return {
    ...user,
    userId,
  };
};
