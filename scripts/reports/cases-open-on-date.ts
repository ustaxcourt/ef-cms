#!/usr/bin/env -S npx ts-node --transpile-only

import { DateTime } from 'luxon';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { appendFileSync } from 'fs';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';

const scriptConfig: ScriptConfig = {
  description:
    'cases-open-on-date - Generates spreadsheets containing a list of cases ' +
    'open on a given date in each of the previous 5 years and, if necessary, ' +
    'spreadsheets containing a list of cases with a NOA filed afterwards.',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    env: 'ENV',
  },
  parameters: {
    day: {
      default: `${DateTime.now().toObject().day}`,
      position: 1,
      type: 'string',
    },
    month: {
      default: `${DateTime.now().toObject().month}`,
      position: 0,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { day, month } = parseArgsAndEnvVars(scriptConfig) as {
  day: string;
  month: string;
};
const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const getAllCasesOpenOnDate = async ({
  applicationContext,
  targetDate,
}: {
  applicationContext: ServerApplicationContext;
  targetDate: string;
}): Promise<RawCase[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  'entityName.S': {
                    value: 'Case',
                  },
                },
              },
              {
                range: {
                  'receivedAt.S': {
                    lte: targetDate,
                  },
                },
              },
              {
                bool: {
                  should: [
                    {
                      range: {
                        'closedDate.S': {
                          gt: targetDate,
                        },
                      },
                    },
                    {
                      bool: {
                        must_not: [
                          {
                            exists: {
                              field: 'closedDate.S',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        sort: [{ 'sortableDocketNumber.N': 'asc' }],
      },
      index: 'efcms-case',
    },
  });
  return results;
};

const getAllNoticesOfAppealFiledInCases = async ({
  applicationContext,
  docketNumbers,
}: {
  applicationContext: ServerApplicationContext;
  docketNumbers: string[];
}): Promise<RawDocketEntry[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  'entityName.S': 'DocketEntry',
                },
              },
              {
                term: {
                  'eventCode.S': 'NOA',
                },
              },
              {
                terms: {
                  'docketNumber.S': docketNumbers,
                },
              },
            ],
          },
        },
        sort: [{ 'receivedAt.S': 'asc' }],
      },
      index: 'efcms-docket-entry',
    },
  });
  return results;
};

const generateCsv = ({
  casesToExamineManually,
  filename,
}: {
  casesToExamineManually: { docketNumber: string; noaFiledOn: string }[];
  filename: string;
}): void => {
  let output = '"Docket Number","NOA Filed On"';
  for (const c of casesToExamineManually) {
    output += `\n"${c.docketNumber}","${c.noaFiledOn}"`;
  }
  appendFileSync(`${OUTPUT_DIR}/${filename}`, output);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const thisYear = DateTime.now().toObject().year;
  const totals: { [year: string]: number } = {};
  const filesGenerated: string[] = [];

  for (let y = thisYear - 4; y <= thisYear; y++) {
    const year = `${y}`;
    const targetDate = validateDateAndCreateISO({ day, month, year })!;
    const targetDateHumanized = targetDate.split('T')[0];
    console.log(`Retrieving cases open on ${targetDateHumanized}...`);
    const casesPotentiallyOpenOnDate = await getAllCasesOpenOnDate({
      applicationContext,
      targetDate,
    });
    const docketNumbers = casesPotentiallyOpenOnDate.map(c => c.docketNumber);
    const noas = await getAllNoticesOfAppealFiledInCases({
      applicationContext,
      docketNumbers,
    });
    const noasFiledAfterDate = noas.filter(de => {
      return de.receivedAt > targetDate;
    });
    const casesWithNoas = noas.map(de => de.docketNumber);
    const casesWithNoasFiledAfterDate = noasFiledAfterDate.map(
      de => de.docketNumber,
    );

    const casesOpenOnDate = casesPotentiallyOpenOnDate.filter(c => {
      return !casesWithNoas.includes(c.docketNumber);
    });
    totals[year] = casesOpenOnDate.length;
    console.log(
      `Found ${casesOpenOnDate.length} cases open on ${targetDateHumanized} that did not go to appeals.`,
    );

    const casesToExamineManually = casesPotentiallyOpenOnDate
      .filter(c => {
        return casesWithNoasFiledAfterDate.includes(c.docketNumber);
      })
      .map(c => ({
        docketNumber: c.docketNumber,
        noaFiledOn: noasFiledAfterDate
          .find(noa => noa.docketNumber === c.docketNumber)!
          .receivedAt.split('T')[0],
      }));
    if (casesToExamineManually.length) {
      console.log(
        `Found ${casesToExamineManually.length} cases opened before ${targetDateHumanized} with NOAs filed after ` +
          `${targetDateHumanized}. Generating CSV...`,
      );
      const filename = `cases-opened-before-${targetDateHumanized}-with-noas-filed-after-${targetDateHumanized}.csv`;
      generateCsv({ casesToExamineManually, filename });
      filesGenerated.push(`${OUTPUT_DIR}/${filename}`);
    }
  }

  let totalsOutput = '"Date","Cases Open"';
  for (const year of Object.keys(totals)) {
    const targetDate = validateDateAndCreateISO({ day, month, year })!;
    const date = targetDate.split('T')[0];
    totalsOutput += `\n"${date}","${totals[year]}"`;
  }
  const monthAndDay = validateDateAndCreateISO({
    day,
    month,
    year: `${thisYear}`,
  })!.substring(5, 10);
  const totalsFilename = `cases-open-on-${monthAndDay}.csv`;
  appendFileSync(`${OUTPUT_DIR}/${totalsFilename}`, totalsOutput);
  filesGenerated.push(`${OUTPUT_DIR}/${totalsFilename}`);

  console.log('\n\n#### Generated files:');
  for (const filename of filesGenerated) {
    console.log(filename);
  }
})();
