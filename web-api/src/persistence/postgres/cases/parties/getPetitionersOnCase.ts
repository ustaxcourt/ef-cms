import { RawPetitioner } from '@shared/business/entities/contacts/Petitioner';
import { getDbReader } from '@web-api/database';

export const getPetitionersOnCase = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawPetitioner[]> => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwPetitionerOnCase')
      .where('docketNumber', '=', docketNumber)
      .orderBy('orderOnCase', 'asc')
      .selectAll()
      .execute(),
  );
};
