import { getDbReader } from '@web-api/database';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { practitionerEntity } from './mapper';

export const getPractitionerByBarNumber = async ({
  barNumber,
}: {
  barNumber: string;
}): Promise<Practitioner> => {
  const formattedBarNumber = barNumber.toUpperCase();

  const user = await getDbReader(reader =>
    reader
      .selectFrom('dwPractitioner as p')
      .where('p.barNumber', '=', formattedBarNumber)
      .selectAll('p')
      .executeTakeFirst(),
  );

  return practitionerEntity(user) as Practitioner;
};
