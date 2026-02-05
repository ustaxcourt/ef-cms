import { docketEntriesBaseQuery } from '@web-api/persistence/postgres/docketEntries/commonQueries';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { DocketEntryKysely } from '@web-api/persistence/postgres/docketEntries/schema';

export const getDocketEntriesByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawDocketEntry[]> => {
  const dbDocketEntries = (await (
    await docketEntriesBaseQuery({ docketNumbers: [docketNumber] })
  )
    .where('docketNumber', '=', docketNumber)
    .execute()) as DocketEntryKysely[];

  return dbDocketEntries.map(d => fromKyselyDocketEntry(d));
};
