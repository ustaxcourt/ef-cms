import {
  formatCaseCaption,
  formatDate,
  formatDocketNumber,
  formatJudgeName,
} from '../helpers/formatters';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { getJsTimeframeForYear } from '@shared/business/utilities/DateHandler';
import { pick } from 'lodash';
import { sql } from 'kysely';

export type EventCodeReportDocketEntry = {
  associatedJudge: string;
  caption: string;
  docketNumber: string;
  docketNumberSuffix?: string | null;
  documentType: string;
  numberOfPages: number | null;
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
          'de.numberOfPages',
          'de.receivedAt',
          'c.associatedJudge',
          'c.caption',
          'c.docketNumberSuffix',
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

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const outputCsv = ({
  distinct,
  docketEntries,
  eventCodes,
  fiscal,
  years,
}: {
  distinct: boolean;
  docketEntries: EventCodeReportDocketEntry[];
  eventCodes: string[];
  fiscal: boolean;
  years: number[];
}) => {
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Date Filed', key: 'filed' },
    { header: 'Document Type', key: 'documentType' },
    { header: 'Judge', key: 'judge' },
    { header: 'Status', key: 'status' },
    { header: 'Case Title', key: 'caption' },
    { header: 'Number of Pages', key: 'numberOfPages' },
  ];
  const filename =
    `${OUTPUT_DIR}/${distinct ? 'distinct-' : ''}` +
    `${eventCodes.map(ec => ec.toLowerCase()).join('-')}-filed-` +
    `in-${fiscal ? 'fy-' : ''}${years.join('-')}.csv`;
  const rows = docketEntries.map(de => ({
    ...pick(de, ['documentType', 'numberOfPages', 'status']),
    caption: formatCaseCaption(de.caption),
    docketNumber: formatDocketNumber(de.docketNumber, de.docketNumberSuffix),
    filed: formatDate(de.receivedAt),
    judge: formatJudgeName(de.associatedJudge),
    numberOfPages: de.numberOfPages || 0,
  }));
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
};

export const eventCodesByYearReport = async ({
  count,
  distinct,
  eventCodes,
  fiscal,
  stricken,
  years,
}: {
  count: boolean;
  distinct: boolean;
  eventCodes: string[];
  fiscal: boolean;
  stricken: boolean;
  years: number[];
}) => {
  if (count) {
    const docCount: number = (await getDocketEntriesByEventCodesAndYears({
      count,
      distinct,
      eventCodes,
      fiscal,
      onlyNonStricken: !stricken,
      years,
    })) as number;
    console.log(
      `Found ${docCount} ${distinct ? 'distinct ' : ''}` +
        `${stricken ? '' : 'non-stricken '} ${eventCodes.join(',')} ` +
        `documents filed in ${fiscal ? 'fy ' : ''}${years.join(',')}`,
    );
    return;
  }
  const docketEntries = (await getDocketEntriesByEventCodesAndYears({
    distinct,
    eventCodes,
    fiscal,
    onlyNonStricken: !stricken,
    years,
  })) as EventCodeReportDocketEntry[];
  console.log(
    `Found ${docketEntries.length} ${distinct ? 'distinct ' : ''}` +
      `${stricken ? '' : 'non-stricken '}${eventCodes.join(',')} ` +
      `documents filed in ${fiscal ? 'fy ' : ''}${years.join(',')}`,
  );
  outputCsv({ docketEntries, distinct, eventCodes, fiscal, years });
};
