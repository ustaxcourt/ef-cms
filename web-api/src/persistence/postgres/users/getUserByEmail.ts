import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';

export const getUserByEmail = async ({
  email,
}: {
  email: string;
}): Promise<User> => {
  const formattedEmail = email.toLowerCase().trim();
  const user = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.email', '=', formattedEmail)
      .selectAll('u')
      .executeTakeFirst(),
  );

  return userEntity(user);
};
