import { getDbReader } from '@web-api/database';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { sql } from 'kysely';

export const getDocketEntriesByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawDocketEntry[]> => {
  const dbDocketEntries = await getDbReader(reader =>
    reader
      .with('affectedDocketEntries', db =>
        db
          .selectFrom('dwDocketEntryOrderMotion')
          .where('served', 'is', true)
          .select([
            'orderDocketEntryId as docketEntryId',
            'orderDocketNumber as docketNumber',
          ])
          .select(fn =>
            fn.fn
              .jsonAgg(
                fn.fn<{ docketEntryId: string; disposition: string }>(
                  'json_build_object',
                  [
                    sql.lit('docketEntryId'),
                    'motionDocketEntryId',
                    sql.lit('disposition'),
                    'disposition',
                  ],
                ),
              )
              .as('affectedDocketEntries'),
          )
          .groupBy(['orderDocketEntryId', 'orderDocketNumber']),
      )
      .with('affectedByDocketEntries', db =>
        db
          .selectFrom('dwDocketEntryOrderMotion')
          .where('served', 'is', true)
          .select([
            'motionDocketEntryId as docketEntryId',
            'motionDocketNumber as docketNumber',
          ])
          .select(fn =>
            fn.fn
              .jsonAgg(
                fn.fn<{ docketEntryId: string; disposition: string }>(
                  'json_build_object',
                  [
                    sql.lit('docketEntryId'),
                    'orderDocketEntryId',
                    sql.lit('disposition'),
                    'disposition',
                  ],
                ),
              )
              .as('affectedByDocketEntries'),
          )
          .groupBy(['motionDocketEntryId', 'motionDocketNumber']),
      )
      .selectFrom('dwDocketEntry as de')
      .leftJoin('affectedDocketEntries', join =>
        join
          .onRef(
            eb => eb.cast('affectedDocketEntries.docketEntryId', 'varchar'),
            '=',
            'de.docketEntryId',
          )
          .onRef('affectedDocketEntries.docketNumber', '=', 'de.docketNumber'),
      )
      .leftJoin('affectedByDocketEntries', join =>
        join
          .onRef(
            eb => eb.cast('affectedByDocketEntries.docketEntryId', 'varchar'),
            '=',
            'de.docketEntryId',
          )
          .onRef(
            'affectedByDocketEntries.docketNumber',
            '=',
            'de.docketNumber',
          ),
      )
      .where('docketNumber', '=', docketNumber)
      .selectAll('de')
      .select('affectedDocketEntries.affectedDocketEntries')
      .select('affectedByDocketEntries.affectedByDocketEntries')
      .execute(),
  );

  return dbDocketEntries.map(d => fromKyselyDocketEntry(d));
};
