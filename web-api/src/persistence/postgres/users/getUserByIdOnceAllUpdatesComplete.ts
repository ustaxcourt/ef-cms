import { RawUser } from '@shared/business/entities/User';
import { sleep } from '@shared/tools/helpers';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export const getUserByIdOnceAllUpdatesComplete = async ({
  userId,
}: {
  userId: string;
}): Promise<
  RawUser | RawPractitioner | RawIrsPractitioner | RawPrivatePractitioner
> => {
  const user = await getUserById({ userId });
  if (user && !user?.isUpdatingInformation) return user;

  await sleep(1500);

  return await getUserByIdOnceAllUpdatesComplete({ userId });
};
