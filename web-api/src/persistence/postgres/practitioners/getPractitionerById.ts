import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { getDbReader } from '@web-api/database';
import {
  PRACTITIONER_ONLY_FIELDS,
  practitionerEntity,
} from '@web-api/persistence/postgres/practitioners/mapper';

export const getPractitionerById = async ({
  userId,
}: {
  userId: string;
}): Promise<
  Practitioner | PrivatePractitioner | IrsPractitioner | undefined
> => {
  const practitionerOnlyFields = PRACTITIONER_ONLY_FIELDS.map(
    field => `p.${field}` as const,
  );

  const practitioner = await getDbReader(reader =>
    reader
      .selectFrom('dwPractitioner as p')
      .leftJoin('dwUser as u', 'u.userId', 'p.userId')
      .where('p.userId', '=', userId)
      .selectAll('u')
      .select(practitionerOnlyFields)
      .executeTakeFirst(),
  );

  if (!practitioner) return undefined;

  return practitionerEntity(practitioner);
};
