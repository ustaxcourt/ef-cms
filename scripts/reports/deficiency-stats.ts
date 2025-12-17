#!/usr/bin/env -S npx ts-node --transpile-only

import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { generateCsv } from '../helpers/generate-csv';

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

const today = createISODateString().split('T')[0];
const OUTPUT_DIR = `${home}/Documents`;
const OUTPUT_FILENAME = `${OUTPUT_DIR}/deficiency-stats_${today}.csv`;

const aggregateDeficiencyAmounts = async (): Promise<
  {
    preferredTrialCity: string;
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
    preferredTrialCity: string;
    totalOutstandingDeficiency: number;
  }[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const columns = [
    { header: 'Preferred Trial Location', key: 'preferredTrialCity' },
    {
      header: 'Total Outstanding Deficiency',
      key: 'totalOutstandingDeficiency',
    },
  ];
  const aggregateResults = await aggregateDeficiencyAmounts();
  const rows = [
    ...aggregateResults.map(result => ({
      ...result,
      totalOutstandingDeficiency: result.totalOutstandingDeficiency.toFixed(2),
    })),
    {
      preferredTrialCity: 'Total',
      totalOutstandingDeficiency: aggregateResults
        .reduce((acc, curr) => acc + curr.totalOutstandingDeficiency, 0)
        .toFixed(2),
    },
  ];
  generateCsv({ columns, filename: OUTPUT_FILENAME, rows });
  console.log(`Generated ${OUTPUT_FILENAME}`);
})();
