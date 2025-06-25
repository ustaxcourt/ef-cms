import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { getDbReader } from '@web-api/database';

export const getPractitionerByBarNumber = async ({
  barNumber,
}: {
  barNumber: string;
}): Promise<RawPractitioner | undefined> => {
  const upperCaseBarNumber = barNumber.toUpperCase();

  const user = await getDbReader(db =>
    db
      .selectFrom('dwUser')
      .where('barNumber', '==', upperCaseBarNumber)
      .selectAll()
      .executeTakeFirst(),
  );

  return user;
};
