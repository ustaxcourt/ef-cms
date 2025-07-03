import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { getDbReader } from '@web-api/database';
import { fromKyselyPractitioner } from '@web-api/persistence/postgres/users/mapper';
import { sql } from 'kysely';

export const getPractitionersBySearchKey = async ({
  searchKey,
  role,
}: {
  searchKey: string;
  role: string;
}): Promise<RawPractitioner[]> => {
  const practitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where(
        sql<boolean>`${sql.ref('p.name')} ILIKE ${searchKey} OR ${sql.ref(
          'p.barNumber',
        )} ILIKE ${searchKey}`,
      )
      .where('u.role', '=', role)
      .selectAll('u')
      .execute(),
  );

  return practitioners.map(fromKyselyPractitioner);
};
