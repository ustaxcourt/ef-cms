import { Role } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import {
  DbUser,
  fromKyselyUser,
} from '@web-api/persistence/postgres/users/mapper';
import { sql } from 'kysely';

export const getPractitionersBySearchKey = async ({
  searchKey,
  role,
}: {
  searchKey: string;
  role: Role;
}): Promise<DbUser[]> => {
  const practitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where(
        sql<boolean>`(${sql.ref('u.name')} ILIKE ${searchKey} OR ${sql.ref(
          'u.barNumber',
        )} ILIKE ${searchKey})`,
      )
      .where('u.role', '=', role)
      .selectAll('u')
      .execute(),
  );

  return practitioners.map(fromKyselyUser);
};
