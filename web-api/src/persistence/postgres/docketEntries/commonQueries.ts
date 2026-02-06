import { Database } from '@web-api/database-schema';
import { getDbReader } from '@web-api/database';
import { SelectQueryBuilder, sql } from 'kysely';

export type DocketEntrySelectableField = keyof Database['dwDocketEntry'];

export const docketEntriesBaseQuery = ({
  docketNumbers,
  selectFields,
}: {
  docketNumbers: string[];
  selectFields?: DocketEntrySelectableField[];
}) =>
  getDbReader(reader => {
    const baseQuery = reader
      .with('affectedDocketEntries', db =>
        db
          .selectFrom('dwDocketEntryRelatedDocketEntry')
          .where('served', 'is', true)
          .where('docketNumber', 'in', docketNumbers)
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
          .where('docketNumber', 'in', docketNumbers)
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
      .where('de.docketNumber', 'in', docketNumbers)
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
      );

    let queryWithSelect: SelectQueryBuilder<any, any, any>;
    if (selectFields && selectFields.length > 0) {
      const prefixedFields = selectFields.map(field => `de.${String(field)}`);
      queryWithSelect = (baseQuery as any).select(prefixedFields);
    } else {
      queryWithSelect = baseQuery.selectAll('de');
    }

    return queryWithSelect
      .select('affectedDocketEntries.affectedDocketEntries')
      .select('affectedByDocketEntries.affectedByDocketEntries');
  });
