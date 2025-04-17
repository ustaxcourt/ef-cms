import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';

export const getUserById = async ({
  userId,
}: {
  userId: string;
}): Promise<User> => {
  const user = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.userId', '=', userId)
      .selectAll('u')
      .executeTakeFirst(),
  );

  return userEntity(user);
};
