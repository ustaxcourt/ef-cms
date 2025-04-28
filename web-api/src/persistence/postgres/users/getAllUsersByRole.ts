import { RawUser } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';

export const getAllUsersByRole = async ({
  roles,
}: {
  roles: string[];
}): Promise<RawUser[]> => {
  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.role', 'in', roles)
      .selectAll('u')
      .execute(),
  );

  return users.map(user => userEntity(user).toRawObject());
};
