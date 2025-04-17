import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { getDbReader } from '@web-api/database';
import { practitionerEntity } from '@web-api/persistence/postgres/practitioners/mapper';

export const getPractitionerById = async ({
  userId,
}: {
  userId: string;
}): Promise<Practitioner | PrivatePractitioner | IrsPractitioner> => {
  const practitioner = await getDbReader(reader =>
    reader
      .selectFrom('dwPractitioner as p')
      .where('p.userId', '=', userId)
      .selectAll('p')
      .executeTakeFirst(),
  );

  return practitionerEntity(practitioner);
};
