import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';

// Note: This function does not fetch practitioner records, therefore should not
// be relied on to return full practitioner information
export const getUserRecordsById = async ({
  userIds,
}: {
  userIds: string[];
}): Promise<User[]> => {
  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.userId', 'in', userIds)
      .selectAll('u')
      .execute(),
  );

  return users.map(user => userEntity(user));
};
