import { ROLES } from '@shared/business/entities/EntityConstants';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { getDbReader } from '@web-api/database';
import {
  irsPractitionerEntity,
  PRACTITIONER_ONLY_FIELDS,
  privatePractitionerEntity,
} from './mapper';
import { sql } from 'kysely';

export const getPractitionersBySearchKey = async ({
  searchKey,
  role,
}: {
  searchKey: string;
  role: string;
}): Promise<IrsPractitioner[] | PrivatePractitioner[]> => {
  const practitionerOnlyFields = PRACTITIONER_ONLY_FIELDS.map(
    field => `p.${field}` as const,
  );

  const practitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwPractitioner as p')
      .leftJoin('dwUser as u', 'u.userId', 'p.userId')
      .where(
        sql<boolean>`${sql.ref('p.name')} ILIKE ${searchKey} OR ${sql.ref(
          'p.barNumber',
        )} ILIKE ${searchKey}`,
      )
      .where('p.role', '=', role)
      .selectAll('u')
      .select(practitionerOnlyFields)
      .execute(),
  );

  if (role === ROLES.irsPractitioner) {
    return practitioners.map(p => irsPractitionerEntity(p));
  } else {
    return practitioners.map(p => privatePractitionerEntity(p));
  }
};
