import { userEntity } from './mapper';
import { getDbReader } from '@web-api/database';
import { Practitioner } from '@shared/business/entities/Practitioner';

export const getPractitionerByBarNumber = async ({
  barNumber,
}: {
  barNumber: string;
}): Promise<Practitioner> => {
  const formattedBarNumber = barNumber.toUpperCase();

  const user = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.barNumber', '=', formattedBarNumber)
      .selectAll('u')
      .executeTakeFirst(),
  );

  return userEntity(user) as Practitioner;
};
