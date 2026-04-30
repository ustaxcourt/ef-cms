import { getDbReader } from '@web-api/persistence/postgres/database';
import { DbUser, fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';

export const getUsersByIds = async ({
  userIds,
}: {
  userIds: string[];
}): Promise<DbUser[]> => {
  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.userId', 'in', userIds)
      .selectAll('u')
      .execute(),
  );

  return users.map(user => fromKyselyUser(user));
};
