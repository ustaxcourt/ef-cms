import { getDbReader } from '@web-api/database';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';

export const getDocketEntriesByDocketNumberAndDocketEntryId = async ({
  docketNumbersAndIds,
}: {
  docketNumbersAndIds: {
    docketNumber: string;
    docketEntryId: string;
  }[];
}): Promise<RawDocketEntry[]> => {
  const dbDocketEntries = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .where(qb =>
        qb.or(
          docketNumbersAndIds.map(pair =>
            qb.and([
              qb('docketEntryId', '=', pair.docketEntryId),
              qb('docketNumber', '=', pair.docketNumber),
            ]),
          ),
        ),
      )
      .selectAll()
      .execute(),
  );

  return dbDocketEntries.map(d => fromKyselyDocketEntry(d));
};
