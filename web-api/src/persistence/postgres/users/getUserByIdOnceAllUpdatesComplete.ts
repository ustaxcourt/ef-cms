import { RawUser } from '@shared/business/entities/User';
import { sleep } from '@shared/tools/helpers';
import { getUserByIdWithPractitioner } from '@web-api/persistence/postgres/users/getUserByIdWithPractitioner';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';

export const getUserByIdOnceAllUpdatesComplete = async ({
  userId,
}: {
  userId: string;
}): Promise<
  | RawUser
  | RawPractitioner
  | RawIrsPractitioner
  | RawPrivatePractitioner
> => {
  const user = await getUserByIdWithPractitioner({ userId });
  if (user && !user?.isUpdatingInformation) return user;

  await sleep(1500);

  return await getUserByIdOnceAllUpdatesComplete({ userId });
};
