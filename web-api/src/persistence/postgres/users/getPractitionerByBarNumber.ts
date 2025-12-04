import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { fromKyselyUser } from './mapper';

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

  return fromKyselyUser(user) as Omit<RawPractitioner, 'serviceIndicator'>;
};
