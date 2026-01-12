import { docketEntriesBaseQuery } from '@web-api/persistence/postgres/docketEntries/commonQueries';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';

export const getDocketEntriesByDocketNumberAndDocketEntryId = async ({
  docketNumbersAndIds,
}: {
  docketNumbersAndIds: {
    docketNumber: string;
    docketEntryId: string;
  }[];
}): Promise<RawDocketEntry[]> => {
  const dbDocketEntries = await (await docketEntriesBaseQuery())
    .where(qb =>
      qb.or(
        docketNumbersAndIds.map(pair =>
          qb.and([
            qb('de.docketEntryId', '=', pair.docketEntryId),
            qb('de.docketNumber', '=', pair.docketNumber),
          ]),
        ),
      ),
    )
    .execute();

  return dbDocketEntries.map(d => fromKyselyDocketEntry(d));
};
