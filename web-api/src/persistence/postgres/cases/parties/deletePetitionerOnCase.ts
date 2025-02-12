import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deletePetitionerOnCase = async ({
  contactId,
  docketNumber,
}: {
  contactId: string;
  docketNumber: string;
}): Promise<number> => {
  const result = await pgDeleteFrom({
    table: 'dwPetitionerOnCase',
    where: cb =>
      cb
        .where('contactId', '=', contactId)
        .where('docketNumber', '=', docketNumber),
  });

  // Rows affected
  return result.length;
};
