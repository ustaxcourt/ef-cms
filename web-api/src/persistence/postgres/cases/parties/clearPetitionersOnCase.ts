import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const clearPetitionersOnCase = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<number> => {
  const result = await pgDeleteFrom({
    table: 'dwPetitionerOnCase',
    where: cb => cb.where('docketNumber', '=', docketNumber),
  });

  return result.length;
};
