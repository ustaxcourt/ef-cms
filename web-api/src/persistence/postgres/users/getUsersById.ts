import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';

export const getUsersById = async ({
  userIds,
}: {
  userIds: string[];
}): Promise<User[]> => {
  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.userId', 'in', userIds)
      .selectAll('u')
      .execute(),
  );

  return users.map(user => userEntity(user));
};
