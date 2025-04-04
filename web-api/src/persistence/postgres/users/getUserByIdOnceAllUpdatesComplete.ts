import { getUserById } from './getUserById';
import { User } from '@shared/business/entities/User';
import { userEntity } from './mapper';
import { sleep } from '@shared/tools/helpers';

export const getUserByIdOnceAllUpdatesComplete = async ({
  userId,
}: {
  userId: string;
}): Promise<User> => {
  const user = await getUserById({ userId });

  if (!user.isUpdatingInformation) return userEntity(user);

  await sleep(1500);

  return await getUserByIdOnceAllUpdatesComplete({ userId });
};
