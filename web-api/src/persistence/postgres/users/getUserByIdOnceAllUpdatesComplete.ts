import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawUser } from '@shared/business/entities/User';
import { sleep } from '@shared/tools/helpers';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export const getUserByIdOnceAllUpdatesComplete = async ({
  userId,
}: {
  userId: string;
}): Promise<
  RawPrivatePractitioner | RawIrsPractitioner | RawPractitioner | RawUser
> => {
  const user = await getUserById({ userId });

  if (!user.isUpdatingInformation) return user;

  await sleep(1500);
  return await getUserByIdOnceAllUpdatesComplete({
    userId,
  });
};
