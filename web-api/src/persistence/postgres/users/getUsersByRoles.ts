import { getDbReader } from '@web-api/database';
import { Role } from '@shared/business/entities/EntityConstants';
import { rawUser } from '@web-api/persistence/postgres/users/mapper';

export const getUsersByRoles = async ({ roles }: { roles: Role[] }) => {
  const users = await getDbReader(async db =>
    db
      .selectFrom('dwUser')
      .where('role', 'in', roles)
      .selectAll('dwUser')
      .execute(),
  );

  return users.map(user => rawUser(user));
};
