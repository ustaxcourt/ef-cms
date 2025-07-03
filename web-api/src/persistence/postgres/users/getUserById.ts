import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawUser } from '@shared/business/entities/User';
import { getUsersByIds } from '@web-api/persistence/postgres/users/getUsersById';

export const getUserById = async ({
  userId,
}: {
  userId: string;
}): Promise<
  | RawPrivatePractitioner
  | RawIrsPractitioner
  | RawPractitioner
  | RawUser
  | undefined
> => {
  const users = await getUsersByIds({ userIds: [userId] });
  return users[0];
};
