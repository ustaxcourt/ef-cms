import { User } from '@shared/business/entities/User';
import { userEntity } from './mapper';
import { getDbReader } from '@web-api/database';

export const getPractitionerByBarNumber = async ({
  barNumber,
}: {
  barNumber: string;
}): Promise<User> => {
  const formattedBarNumber = barNumber.toUpperCase();

  const user = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.barNumber', '=', formattedBarNumber)
      .selectAll('u')
      .executeTakeFirst(),
  );

  // 10495 TODO: should map to petitioner
  return userEntity(user);
};
