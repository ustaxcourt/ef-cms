import { getDbReader } from '@web-api/persistence/postgres/database';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';

export const getDocketEntriesById = async ({
  docketEntryId,
}: {
  docketEntryId: string;
}): Promise<RawDocketEntry[]> => {
  const dbDocketEntries = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .where('docketEntryId', '=', docketEntryId)
      .selectAll()
      .execute(),
  );

  return dbDocketEntries.map(d => fromKyselyDocketEntry(d));
};
