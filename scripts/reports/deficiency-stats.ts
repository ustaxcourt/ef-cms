#!/usr/bin/env -S npx ts-node --transpile-only

import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { formatCurrency, formatDate } from '../helpers/formatters';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { sql } from 'kysely';

const scriptConfig: ScriptConfig = {
  description:
    'deficiency-stats - Aggregates total IRS deficiency amount across open cases',
  environment: {
    env: 'ENV',
    home: 'HOME',
  },
  requireActiveAwsSession: true,
};
const { home } = parseArgsAndEnvVars(scriptConfig) as { home: string };

const today = formatDate(createISODateString());
const OUTPUT_DIR = `${home}/Documents`;
const OUTPUT_FILENAME = `${OUTPUT_DIR}/deficiency-stats_${today}.csv`;

const aggregateDeficiencyAmounts = async (): Promise<
  {
    openCases: number;
    preferredTrialCity: string;
    smallCases: number;
    totalOutstandingDeficiency: number;
  }[]
> => {
  return (await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .crossJoin(sql`LATERAL jsonb_array_elements(statistics)`.as('stats'))
      .select(({ fn }) => [
        'preferredTrialCity',
        fn
          .sum<number>(sql<number>`(stats->>'irsDeficiencyAmount')::float`)
          .as('total_outstanding_deficiency'),
        fn.count('docketNumber').as('open_cases'),
        fn
          .count('docketNumber')
          .filterWhere('procedureType', '=', 'Small')
          .as('small_cases'),
      ])
      .where('status', 'not in', [
        CASE_STATUS_TYPES.closed,
        CASE_STATUS_TYPES.closedDismissed,
        CASE_STATUS_TYPES.onAppeal,
      ])
      .where('preferredTrialCity', 'is not', null)
      .where(sql`stats->>'irsDeficiencyAmount'`, 'is not', null)
      .groupBy('preferredTrialCity')
      .execute(),
  )) as unknown as {
    openCases: number;
    preferredTrialCity: string;
    smallCases: number;
    totalOutstandingDeficiency: number;
  }[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const aggregateResults = await aggregateDeficiencyAmounts();
  const totalOpenCases = aggregateResults.reduce(
    (acc, curr) => acc + Number(curr.openCases),
    0,
  );
  const totalSmallCases = aggregateResults.reduce(
    (acc, curr) => acc + Number(curr.smallCases),
    0,
  );
  const totalOutstandingDeficiency = aggregateResults.reduce(
    (acc, curr) => acc + Number(curr.totalOutstandingDeficiency),
    0,
  );

  const columns = [
    { header: 'Preferred Trial Location', key: 'preferredTrialCity' },
    { header: 'Open Cases', key: 'openCases' },
    {
      header: 'Total Outstanding Deficiency',
      key: 'totalOutstandingDeficiency',
    },
    {
      header: 'Percentage of Small Cases',
      key: 'smallCasesPct',
    },
  ];
  const rows = [
    ...aggregateResults.map(result => ({
      ...result,
      smallCasesPct: `${(result.smallCases / result.openCases) * 100}%`,
      totalOutstandingDeficiency: formatCurrency(
        result.totalOutstandingDeficiency,
      ),
    })),
    {
      openCases: totalOpenCases,
      preferredTrialCity: 'Total',
      smallCasesPct: `${(totalSmallCases / totalOpenCases) * 100}%`,
      totalOutstandingDeficiency: formatCurrency(totalOutstandingDeficiency),
    },
  ];
  generateCsv({ columns, filename: OUTPUT_FILENAME, rows });
  console.log(`Generated ${OUTPUT_FILENAME}`);
})();
