import { getDbReader } from '@web-api/database';
import { rawUser } from '@web-api/persistence/postgres/users/mapper';

export const getUserById = async ({ userId }: { userId: string }) => {
  const user = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.userId', '=', userId)
      .selectAll('u')
      .executeTakeFirst(),
  );

  // if (!user) return undefined;

  return rawUser(user);
};
