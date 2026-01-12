import { sleep } from '@shared/tools/helpers';
import { NotFoundError } from '@web-api/errors/errors';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

export const getUserByIdOnceAllUpdatesComplete = async ({
  userId,
}: {
  userId: string;
}): Promise<DbUser> => {
  const user = await getUserById({ userId });

  if (!user) {
    throw new NotFoundError(`User not found with user id ${userId}`);
  }

  if (!user.isUpdatingInformation) return user;

  await sleep(1500);
  return await getUserByIdOnceAllUpdatesComplete({
    userId,
  });
};
