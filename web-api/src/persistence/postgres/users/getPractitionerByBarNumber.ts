import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { rawUser } from './mapper';
import { getDbReader } from '@web-api/persistence/postgres/database';

export const getPractitionerByBarNumber = async ({
  barNumber,
}: {
  barNumber: string;
}): Promise<Omit<RawPractitioner, 'serviceIndicator'> | undefined> => {
  const upperCaseBarNumber = barNumber.toUpperCase();

  const user = await getDbReader(db =>
    db
      .selectFrom('dwUser')
      .where('barNumber', '=', upperCaseBarNumber)
      .selectAll()
      .executeTakeFirst(),
  );

  if (!user) {
    return undefined;
  }

  return rawUser(user) as Omit<RawPractitioner, 'serviceIndicator'>;
};
