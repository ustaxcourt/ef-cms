import { getDbReader } from '@web-api/persistence/postgres/database';
import { getJsTimeframeForYear } from '../helpers/parseArgsAndEnvVars';
import { sql } from 'kysely';

export type EventCodeReportDocketEntry = {
  associatedJudge: string;
  caption: string;
  docketNumber: string;
  documentType: string;
  receivedAt: Date;
  status: string;
};

export const getDocketEntriesByEventCodesAndYears = async ({
  count,
  distinct,
  eventCodes,
  fiscal,
  onlyNonStricken,
  years,
}: {
  count?: boolean;
  distinct?: boolean;
  eventCodes: string[];
  fiscal: boolean;
  onlyNonStricken?: boolean;
  years?: number[];
}): Promise<number | EventCodeReportDocketEntry[]> => {
  const results: { count: number } | EventCodeReportDocketEntry[] =
    await getDbReader(async reader => {
      let baseQuery = reader
        .selectFrom('dwDocketEntry as de')
        .where('de.eventCode', 'in', eventCodes);

      if (onlyNonStricken) {
        baseQuery = baseQuery.where('de.isStricken', '!=', true);
      }
      if (years && years.length) {
        if (years.length === 1) {
          const { begin, end } = getJsTimeframeForYear({
            fiscal,
            year: `${years[0]}`,
          });
          baseQuery = baseQuery
            .where('de.receivedAt', '>=', begin)
            .where('de.receivedAt', '<', end);
        } else {
          baseQuery = baseQuery.where(qb =>
            qb.or(
              years.map(year => {
                const { begin, end } = getJsTimeframeForYear({
                  fiscal,
                  year: `${year}`,
                });
                return qb.and([
                  qb('de.receivedAt', '>=', begin),
                  qb('de.receivedAt', '<', end),
                ]);
              }),
            ),
          );
        }
      }

      if (count) {
        const countQuery = distinct
          ? baseQuery.select(({ ref }) =>
              sql<number>`count(distinct ${ref('de.docketEntryId')})`.as(
                'count',
              ),
            )
          : baseQuery.select(reader.fn.countAll().as('count'));

        return (await countQuery.executeTakeFirst()) as { count: number };
      }

      const query = baseQuery
        .innerJoin('dwCase as c', 'de.docketNumber', 'c.docketNumber')
        .select([
          'de.docketNumber',
          'de.documentType',
          'de.receivedAt',
          'c.associatedJudge',
          'c.caption',
          'c.status',
        ]);

      if (distinct) {
        const distinctQuery = query
          .distinctOn('de.docketEntryId')
          .orderBy('de.docketEntryId', 'asc')
          .orderBy('de.servedAt', 'asc')
          .orderBy('de.docketNumber', 'asc');

        return (await reader
          .with('distinctDocketEntries', () => distinctQuery)
          .selectFrom('distinctDocketEntries')
          .selectAll()
          .orderBy('receivedAt', 'asc')
          .orderBy('docketNumber', 'asc')
          .execute()) as EventCodeReportDocketEntry[];
      }

      return (await query.execute()) as EventCodeReportDocketEntry[];
    });
  return count
    ? (results as { count: number }).count
    : (results as EventCodeReportDocketEntry[]);
};
