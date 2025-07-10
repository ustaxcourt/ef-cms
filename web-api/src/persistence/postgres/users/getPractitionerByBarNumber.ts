import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { getDbReader } from '@web-api/database';
import { rawUser } from './mapper';

export const getPractitionerByBarNumber = async ({
  barNumber,
}: {
  barNumber: string;
}): Promise<RawPractitioner | undefined> => {
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

  return rawUser(user) as RawPractitioner;
};
