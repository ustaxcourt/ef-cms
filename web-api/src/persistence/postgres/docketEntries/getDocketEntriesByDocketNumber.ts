import { docketEntriesBaseQuery } from '@web-api/persistence/postgres/docketEntries/commonQueries';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';

export const getDocketEntriesByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawDocketEntry[]> => {
  const dbDocketEntries = await (await docketEntriesBaseQuery)
    .where('docketNumber', '=', docketNumber)
    .execute();

  return dbDocketEntries.map(d => fromKyselyDocketEntry(d));
};
