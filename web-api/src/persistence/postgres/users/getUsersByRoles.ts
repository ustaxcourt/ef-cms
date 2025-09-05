import { getDbReader } from '@web-api/database';
import { Role } from '@shared/business/entities/EntityConstants';
import { DbUser, fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';

export const getUsersByRoles = async ({
  roles,
}: {
  roles: Role[];
}): Promise<DbUser[]> => {
  const users = await getDbReader(db =>
    db
      .selectFrom('dwUser')
      .where('role', 'in', roles)
      .selectAll('dwUser')
      .execute(),
  );

  return users.map(user => fromKyselyUser(user));
};
