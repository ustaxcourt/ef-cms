import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';

export const getUsersInSection = async ({
  section,
}: {
  section: string;
}): Promise<User[]> => {
  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.section', '=', section)
      .selectAll('u')
      .execute(),
  );

  return users.map(user => userEntity(user)) as User[];
};
