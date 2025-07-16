import { getUsersByIds } from '@web-api/persistence/postgres/users/getUsersById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

export const getUserById = async ({
  userId,
}: {
  userId: string;
}): Promise<DbUser | undefined> => {
  const users = await getUsersByIds({ userIds: [userId] });

  if (!users[0]) {
    return undefined;
  }
  return users[0];
};
