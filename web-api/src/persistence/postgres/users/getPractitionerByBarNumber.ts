import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { getDbReader } from '@web-api/database';
import { rawUser } from './mapper';
import { NotFoundError } from '@web-api/errors/errors';

export const getPractitionerByBarNumber = async ({
  barNumber,
}: {
  barNumber: string;
}): Promise<RawPractitioner> => {
  const upperCaseBarNumber = barNumber.toUpperCase();

  const user = await getDbReader(db =>
    db
      .selectFrom('dwUser')
      .where('barNumber', '=', upperCaseBarNumber)
      .selectAll()
      .executeTakeFirst(),
  );

  if (!user) {
    throw new NotFoundError(`Practitioner of ${barNumber} was not found`);
  }

  return rawUser(user) as RawPractitioner;
};
