import { getDbReader } from '@web-api/database';
import { getJsTimeframeForYear } from '../helpers/parseArgsAndEnvVars';

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
  eventCodes,
  fiscal,
  onlyNonStricken,
  years,
}: {
  count?: boolean;
  eventCodes: string[];
  fiscal: boolean;
  onlyNonStricken?: boolean;
  years?: number[];
}): Promise<number | EventCodeReportDocketEntry[]> => {
  const results: { count: number } | EventCodeReportDocketEntry[] =
    await getDbReader(async reader => {
      let query = reader.selectFrom('dwDocketEntry as de');
      if (count) {
        query = query.select(reader.fn.countAll().as('count'));
      } else {
        query = query
          .innerJoin('dwCase as c', 'de.docketNumber', 'c.docketNumber')
          .select([
            'de.docketNumber',
            'de.documentType',
            'de.receivedAt',
            'c.associatedJudge',
            'c.caption',
            'c.status',
          ]);
      }
      query = query.where('de.eventCode', 'in', eventCodes);
      if (onlyNonStricken) {
        query = query.where('de.isStricken', '!=', true);
      }
      if (years && years.length) {
        if (years.length === 1) {
          const { begin, end } = getJsTimeframeForYear({
            fiscal,
            year: `${years[0]}`,
          });
          query = query
            .where('de.receivedAt', '>=', begin)
            .where('de.receivedAt', '<', end);
        } else {
          query = query.where(qb =>
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
        return (await query.executeTakeFirst()) as { count: number };
      }
      return (await query.execute()) as EventCodeReportDocketEntry[];
    });
  return count
    ? (results as { count: number }).count
    : (results as EventCodeReportDocketEntry[]);
};
