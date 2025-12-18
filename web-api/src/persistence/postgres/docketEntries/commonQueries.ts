import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

export const docketEntriesBaseQuery = getDbReader(reader =>
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
        .onRef('affectedByDocketEntries.docketEntryId', '=', 'de.docketEntryId')
        .onRef('affectedByDocketEntries.docketNumber', '=', 'de.docketNumber'),
    )
    .selectAll('de')
    .select('affectedDocketEntries.affectedDocketEntries')
    .select('affectedByDocketEntries.affectedByDocketEntries'),
);
