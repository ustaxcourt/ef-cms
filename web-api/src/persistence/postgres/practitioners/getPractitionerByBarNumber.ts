import { getDbReader } from '@web-api/database';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PRACTITIONER_ONLY_FIELDS, practitionerEntity } from './mapper';

export const getPractitionerByBarNumber = async ({
  barNumber,
}: {
  barNumber: string;
}): Promise<Practitioner | undefined> => {
  const formattedBarNumber = barNumber.toUpperCase();
  const practitionerOnlyFields = PRACTITIONER_ONLY_FIELDS.map(
    field => `p.${field}` as const,
  );

  const user = await getDbReader(reader =>
    reader
      .selectFrom('dwPractitioner as p')
      .leftJoin('dwUser as u', 'u.userId', 'p.userId')
      .where('p.barNumber', '=', formattedBarNumber)
      .selectAll('u')
      .select(practitionerOnlyFields)
      .executeTakeFirst(),
  );

  if (!user) return undefined;

  return practitionerEntity(user);
};
