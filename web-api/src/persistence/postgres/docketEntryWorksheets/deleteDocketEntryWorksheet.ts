import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deleteDocketEntryWorksheet = async ({
  docketEntryId,
}: {
  docketEntryId: string;
}): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwDocketEntryWorksheet',
    where: cb => cb.where('docketEntryId', '=', docketEntryId),
  });
};
