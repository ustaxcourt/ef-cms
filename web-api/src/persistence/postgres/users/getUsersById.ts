import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawUser } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { rawUser } from '@web-api/persistence/postgres/users/mapper';

export const getUsersByIds = async ({
  userIds,
}: {
  userIds: string[];
}): Promise<
  (RawPrivatePractitioner | RawIrsPractitioner | RawPractitioner | RawUser)[]
> => {
  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.userId', 'in', userIds)
      .selectAll('u')
      .execute(),
  );

  return users.map(user => rawUser(user));
};
