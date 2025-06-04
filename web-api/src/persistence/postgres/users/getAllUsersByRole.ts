import { RawUser } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { rawUserWithPractitionerEntity } from '@web-api/persistence/postgres/users/mapper';
import { PRACTITIONER_ONLY_FIELDS } from '../practitioners/mapper';

export const getAllUsersByRole = async ({
  roles,
}: {
  roles: string[];
}): Promise<RawUser[]> => {
  const practitionerOnlyFields = PRACTITIONER_ONLY_FIELDS.map(
    field => `p.${field}` as const,
  );

  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.role', 'in', roles)
      .leftJoin('dwPractitioner as p', 'u.userId', 'p.userId')
      .selectAll('u')
      .select(practitionerOnlyFields)
      .execute(),
  );

  return users.map(user => rawUserWithPractitionerEntity(user));
};
