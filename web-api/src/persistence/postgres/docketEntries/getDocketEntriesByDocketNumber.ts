import { getDbReader } from '@web-api/database';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';

export const getDocketEntriesByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawDocketEntry[]> => {
  const dbDocketEntries = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .execute(),
  );

  return dbDocketEntries.map(d => fromKyselyDocketEntry(d));
};
