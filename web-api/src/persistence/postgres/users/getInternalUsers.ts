import { INTERNAL_ROLES } from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';

export const getInternalUsers = async (): Promise<User[]> => {
  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.role', 'in', Object.values(INTERNAL_ROLES) as string[])
      .selectAll('u')
      .execute(),
  );

  return users.map(user => userEntity(user));
};
