import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { docketEntryWorksheetEntity } from '@web-api/persistence/postgres/docketEntryWorksheets/mapper';

export const getDocketEntryWorksheetsByDocketEntryIds = async ({
  docketEntryIds,
}: {
  docketEntryIds: string[];
}): Promise<RawDocketEntryWorksheet[]> => {
  if (!docketEntryIds?.length) {
    return [];
  }

  const docketEntryWorksheets = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntryWorksheet')
      .selectAll()
      .where('docketEntryId', 'in', docketEntryIds)
      .execute(),
  );

  return docketEntryWorksheets.map(item =>
    docketEntryWorksheetEntity(item).toRawObject(),
  );
};
