import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deleteDocketEntry = async ({
  docketEntryId,
  docketNumber,
}: {
  docketEntryId: string;
  docketNumber: string;
}): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwDocketEntry',
    where: db =>
      db
        .where('docketNumber', '=', docketNumber)
        .where('docketEntryId', '=', docketEntryId),
  });
};
