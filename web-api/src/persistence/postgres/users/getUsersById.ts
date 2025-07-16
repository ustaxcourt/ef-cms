import { getDbReader } from '@web-api/database';
import { DbUser, rawUser } from '@web-api/persistence/postgres/users/mapper';

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

  return users.map(user => rawUser(user));
};
