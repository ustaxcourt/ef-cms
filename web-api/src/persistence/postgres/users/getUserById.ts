import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawUser } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { PRACTITIONER_ONLY_FIELDS } from '@web-api/persistence/postgres/practitioners/mapper';
import { rawUserWithPractitionerEntity } from '@web-api/persistence/postgres/users/mapper';

export const getUserById = async ({
  userId,
}: {
  userId: string;
}): Promise<
  | RawUser
  | RawPractitioner
  | RawIrsPractitioner
  | RawPrivatePractitioner
  | undefined
> => {
  const practitionerOnlyFields = PRACTITIONER_ONLY_FIELDS.map(
    field => `p.${field}` as const,
  );

  const user = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.userId', '=', userId)
      .leftJoin('dwPractitioner as p', 'u.userId', 'p.userId')
      .selectAll('u')
      .select(practitionerOnlyFields)
      .executeTakeFirst(),
  );

  if (!user) return undefined;

  return rawUserWithPractitionerEntity(user);
};
