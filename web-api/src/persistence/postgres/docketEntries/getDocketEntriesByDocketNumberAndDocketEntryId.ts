import { getDbReader } from '@web-api/database';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { sql } from 'kysely';

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
      .with('affectedDocketEntries', db =>
        db
          .selectFrom('dwDocketEntryRelatedDocketEntry')
          .where('served', 'is', true)
          .select(['primaryDocketEntryId as docketEntryId', 'docketNumber'])
          .select(fn =>
            fn.fn
              .jsonAgg(
                fn.fn<{ docketEntryId: string; disposition: string }>(
                  'json_build_object',
                  [
                    sql.lit('docketEntryId'),
                    'secondaryDocketEntryId',
                    sql.lit('disposition'),
                    'disposition',
                  ],
                ),
              )
              .as('affectedDocketEntries'),
          )
          .groupBy(['primaryDocketEntryId', 'docketNumber']),
      )
      .with('affectedByDocketEntries', db =>
        db
          .selectFrom('dwDocketEntryRelatedDocketEntry')
          .where('served', 'is', true)
          .select(['secondaryDocketEntryId as docketEntryId', 'docketNumber'])
          .select(fn =>
            fn.fn
              .jsonAgg(
                fn.fn<{ docketEntryId: string; disposition: string }>(
                  'json_build_object',
                  [
                    sql.lit('docketEntryId'),
                    'primaryDocketEntryId',
                    sql.lit('disposition'),
                    'disposition',
                  ],
                ),
              )
              .as('affectedByDocketEntries'),
          )
          .groupBy(['secondaryDocketEntryId', 'docketNumber']),
      )
      .selectFrom('dwDocketEntry as de')
      .leftJoin('affectedDocketEntries', join =>
        join
          .onRef('affectedDocketEntries.docketEntryId', '=', 'de.docketEntryId')
          .onRef('affectedDocketEntries.docketNumber', '=', 'de.docketNumber'),
      )
      .leftJoin('affectedByDocketEntries', join =>
        join
          .onRef(
            'affectedByDocketEntries.docketEntryId',
            '=',
            'de.docketEntryId',
          )
          .onRef(
            'affectedByDocketEntries.docketNumber',
            '=',
            'de.docketNumber',
          ),
      )
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
      .selectAll('de')
      .select('affectedDocketEntries.affectedDocketEntries')
      .select('affectedByDocketEntries.affectedByDocketEntries')
      .execute(),
  );

  return dbDocketEntries.map(d => fromKyselyDocketEntry(d));
};
