#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { appendFileSync } from 'fs';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { getDbReader } from '@web-api/persistence/postgres/database';
import {
  getJsDateFromIso,
  getNowObject,
  validateDateAndCreateISO,
} from '@shared/business/utilities/DateHandler';
import { formatDate } from '../helpers/formatters';

const nowObject = getNowObject();
const scriptConfig: ScriptConfig = {
  description:
    'cases-open-on-date - Generates spreadsheets containing a list of cases ' +
    'open on a given date in each of the previous 5 years and, if necessary, ' +
    'spreadsheets containing a list of cases with a NOA filed afterwards.',
  environment: {
    env: 'ENV',
  },
  parameters: {
    day: {
      default: `${nowObject.day}`,
      position: 1,
      type: 'string',
    },
    month: {
      default: `${nowObject.month}`,
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
  targetDate,
}: {
  targetDate: string;
}): Promise<RawCase[]> => {
  const targetJsDate = getJsDateFromIso(targetDate);
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwCase as c')
        .selectAll('c')
        .where('c.receivedAt', '<=', targetJsDate)
        .where(eb =>
          eb.or([
            eb('c.closedDate', 'is', null),
            eb('c.closedDate', '>', targetJsDate),
          ]),
        )
        .orderBy('c.sortableDocketNumber', 'asc')
        .execute(),
    )
  ).map(fromKyselyCase) as RawCase[];
};

const getAllNoticesOfAppealFiledInCases = async ({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<RawDocketEntry[]> => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwDocketEntry as de')
        .selectAll('de')
        .where('de.eventCode', '=', 'NOA')
        .where('de.docketNumber', 'in', docketNumbers)
        .orderBy('de.receivedAt', 'asc')
        .execute(),
    )
  ).map(fromKyselyDocketEntry) as RawDocketEntry[];
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
  const thisYear = nowObject.year!;
  const totals: { [year: string]: number } = {};
  const filesGenerated: string[] = [];

  for (let y = thisYear - 4; y <= thisYear; y++) {
    const year = `${y}`;
    const targetDate = validateDateAndCreateISO({ day, month, year })!;
    const targetDateHumanized = formatDate(targetDate);
    console.log(`Retrieving cases open on ${targetDateHumanized}...`);
    const casesPotentiallyOpenOnDate = await getAllCasesOpenOnDate({
      targetDate,
    });
    const docketNumbers = casesPotentiallyOpenOnDate.map(c => c.docketNumber);
    const noas = await getAllNoticesOfAppealFiledInCases({
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
        noaFiledOn: formatDate(
          noasFiledAfterDate.find(noa => noa.docketNumber === c.docketNumber)!
            .receivedAt,
        ),
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
    const date = formatDate(targetDate);
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
