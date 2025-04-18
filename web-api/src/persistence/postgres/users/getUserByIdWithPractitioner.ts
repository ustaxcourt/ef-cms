import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawUser } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { rawUserWithPractitionerEntity } from '@web-api/persistence/postgres/users/mapper';
import { PRACTITIONER_ONLY_FIELDS } from '../practitioners/mapper';

export const getUserByIdWithPractitioner = async ({
  userId,
}: {
  userId: string;
}): Promise<
  RawUser | RawPractitioner | RawIrsPractitioner | RawPrivatePractitioner
> => {
  const user = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.userId', '=', userId)
      .leftJoin('dwPractitioner as p', 'u.userId', 'p.userId')
      .selectAll('u')
      .select(PRACTITIONER_ONLY_FIELDS)
      .executeTakeFirst(),
  );

  return rawUserWithPractitionerEntity(user);
};
