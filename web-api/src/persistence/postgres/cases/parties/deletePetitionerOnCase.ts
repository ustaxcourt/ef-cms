import { getDbWriter } from '@web-api/database';

export const deletePetitionerOnCase = async ({
  contactId,
  docketNumber,
}: {
  contactId: string;
  docketNumber: string;
}): Promise<number> => {
  const result = await getDbWriter(writer =>
    writer
      .deleteFrom('dwPetitionerOnCase')
      .where('contactId', '=', contactId)
      .where('docketNumber', '=', docketNumber)
      .execute(),
  );

  // Rows affected
  return result.length;
};
