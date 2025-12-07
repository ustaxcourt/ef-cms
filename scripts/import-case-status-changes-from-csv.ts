#!/usr/bin/env -S npx ts-node --transpile-only

import {
  FORMATS,
  prepareDateFromEST,
} from '@shared/business/utilities/DateHandler';
import { SYSTEM_ROLE } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';

const scriptConfig: ScriptConfig = {
  description:
    'import-case-status-changes-from-csv - Ingests case status changes from ' +
    "a CSV and inserts entries into each case's caseStatusHistory array.",
  environment: {
    env: 'ENV',
    home: 'HOME',
  },
  requireActiveAwsSession: true,
};
const { home } = parseArgsAndEnvVars(scriptConfig) as {
  home: string;
};

//  Example CSV content:
//     Docket,Date,Status
//     23887-13L,3/24/2022,CAV
//     22570-18W,3/9/2020,CAV
const INPUT_FILE = `${home}/Downloads/case-status-changes.csv`;

const getCaseRecord = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<Omit<RawCase, 'consolidatedCases'> | undefined> => {
  const cases = await getCasesByDocketNumbers({
    docketNumbers: [docketNumber],
  });
  return cases[0];
};

const putCaseStatusHistoryRecord = async ({
  caseRecord,
  date,
  updatedCaseStatus,
}: {
  caseRecord: Omit<RawCase, 'consolidatedCases'>;
  date: string;
  updatedCaseStatus: string;
}): Promise<boolean> => {
  if (!caseRecord.caseStatusHistory) {
    caseRecord.caseStatusHistory = [];
  }
  caseRecord.caseStatusHistory.push({
    changedBy: SYSTEM_ROLE,
    date,
    updatedCaseStatus,
  });

  let result = false;
  try {
    // Add consolidatedCases as empty array to satisfy RawCase type requirement
    await upsertCases([
      caseRecord as RawCase,
    ]);
    result = true;
  } catch (error) {
    console.log(error);
  }
  return result;
};

const parseCsv = (): Array<any> => {
  const csvOptions = {
    columns: ['docketNumber', 'date', 'updatedCaseStatus'],
    delimiter: ',',
    from_line: 2,
  };
  const csvContent = fs.readFileSync(INPUT_FILE, 'utf8');
  return parse(csvContent, csvOptions);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const statusChangesToLog = parseCsv();
  for (const statusChange of statusChangesToLog) {
    const { updatedCaseStatus } = statusChange;
    const date = prepareDateFromEST(statusChange.date, FORMATS.MDYYYY);
    const docketNumber = statusChange.docketNumber.replace(/[^\d-]/g, '');
    const caseRecord = await getCaseRecord({ docketNumber });
    if (caseRecord && date) {
      const caseStatusHistoryUpdated = await putCaseStatusHistoryRecord({
        caseRecord,
        date,
        updatedCaseStatus,
      });
      if (caseStatusHistoryUpdated) {
        console.log(`Added ${updatedCaseStatus} status to ${docketNumber}`);
      }
    }
  }
})();
