import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { toKyselyNewDocketEntryWorksheet } from '@web-api/persistence/postgres/docketEntryWorksheets/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertDocketEntryWorksheets = async ({
  docketEntryWorksheets,
}: {
  docketEntryWorksheets: RawDocketEntryWorksheet[];
}): Promise<void> => {
  if (docketEntryWorksheets.length === 0) return;

  const docketEntryWorksheetsToUpsert = docketEntryWorksheets.map(
    docketEntryWorksheet =>
      toKyselyNewDocketEntryWorksheet({ docketEntryWorksheet }),
  );

  await pgInsertInto({
    table: 'dwDocketEntryWorksheet',
    values: docketEntryWorksheetsToUpsert,
    onConflictColumns: ['docketEntryId'],
  });
};
