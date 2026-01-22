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
import { pick } from 'lodash';

const scriptConfig: ScriptConfig = {
  description: 'deficiencies - Outputs cases with IRS deficiencies',
  environment: {
    env: 'ENV',
    home: 'HOME',
  },
  parameters: {
    max: {
      default: '0',
      description: 'Maximum IRS deficiency amount to include in report',
      required: false,
      short: 'x',
      transform: 'number',
      type: 'string',
    },
    min: {
      default: '0',
      description: 'Minimum IRS deficiency amount to include in report',
      required: false,
      short: 'n',
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { home, max, min } = parseArgsAndEnvVars(scriptConfig) as {
  home: string;
  max: number;
  min: number;
};

type tDeficiencyCase = {
  associatedJudge: string;
  caption: string;
  docketNumber: string;
  irsDeficiencyAmount: number;
  preferredTrialCity: string;
};

const today = createISODateString().split('T')[0];
const OUTPUT_DIR = `${home}/Documents`;
let outputFilename = 'deficiencies_';
if (min !== max) {
  if (max === 0) {
    outputFilename += `greater_than_${min}_`;
  } else if (min === 0) {
    outputFilename += `less_than_${max}_`;
  } else {
    outputFilename += `${min}-${max}_`;
  }
}
outputFilename += `${today}.csv`;
const OUTPUT_FILENAME = `${OUTPUT_DIR}/${outputFilename}`;

const getDeficiencyCases = async (): Promise<tDeficiencyCase[]> => {
  return (await getDbReader(reader => {
    const cteQuery = reader
      .selectFrom('dwCase as c')
      .crossJoin(sql`LATERAL jsonb_array_elements(c.statistics)`.as('stats'))
      .select(({ fn }) => [
        'c.associatedJudge',
        'c.caption',
        'c.docketNumber',
        fn
          .sum<number>(sql<number>`(stats->>'irsDeficiencyAmount')::float`)
          .as('irsDeficiencyAmount'),
        'c.preferredTrialCity',
        'c.status',
      ])
      .where(sql`stats->>'irsDeficiencyAmount'`, 'is not', null)
      .where('c.status', 'not in', [
        CASE_STATUS_TYPES.closed,
        CASE_STATUS_TYPES.closedDismissed,
        CASE_STATUS_TYPES.onAppeal,
      ])
      .groupBy([
        'c.docketNumber',
        'c.associatedJudge',
        'c.caption',
        'c.preferredTrialCity',
        'c.status',
      ]);

    let query = reader
      .with('deficiencyCteQuery', () => cteQuery)
      .selectFrom('deficiencyCteQuery')
      .selectAll();
    if (min !== max) {
      if (min > 0) {
        query = query.where('irsDeficiencyAmount', '>=', min);
      }
      if (max > 0) {
        query = query.where('irsDeficiencyAmount', '<=', max);
      }
    }

    return query.orderBy('irsDeficiencyAmount', 'desc').execute();
  })) as unknown as tDeficiencyCase[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const deficiencyCases = await getDeficiencyCases();

  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Case Title', key: 'caption' },
    { header: 'Judge', key: 'judge' },
    { header: 'Case Status', key: 'status' },
    { header: 'Preferred Trial City', key: 'preferredTrialCity' },
    {
      header: 'IRS Deficiency Amount',
      key: 'irsDeficiencyAmount',
    },
  ];
  const rows = [
    ...deficiencyCases.map(result => ({
      ...pick(result, [
        'caption',
        'docketNumber',
        'irsDeficiencyAmount',
        'status',
      ]),
      judge:
        result.associatedJudge
          ?.replace('Chief Special Trial ', '')
          .replace('Special Trial ', '')
          .replace('Judge ', '') || '',
      preferredTrialCity: result.preferredTrialCity || '',
    })),
  ];

  console.log(
    `Found ${deficiencyCases.length} ${!closed ? 'open ' : ''}deficiency cases`,
  );
  generateCsv({ columns, filename: OUTPUT_FILENAME, rows });
  console.log(`Generated ${OUTPUT_FILENAME}`);
})();
