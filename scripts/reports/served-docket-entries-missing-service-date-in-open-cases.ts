#!/usr/bin/env -S npx ts-node --transpile-only

import { CLOSED_CASE_STATUSES } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/database';

const scriptConfig: ScriptConfig = {
  description:
    'served-docket-entries-missing-service-date-in-open-cases - Generates a ' +
    'CSV of legacy-served documents that are missing a service timestamp',
  environment: {
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const getDocketNumbersOfAllOpenCases = async (): Promise<string[]> => {
  const results = (await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .select('c.docketNumber')
      .where('c.status', 'not in', CLOSED_CASE_STATUSES)
      .orderBy('c.sortableDocketNumber', 'asc')
      .execute(),
  )) as { docketNumber: string }[];
  return results.map(c => c.docketNumber);
};

const getDocketEntriesMissingServiceDate = async ({
  openCases,
}: {
  openCases: string[];
}): Promise<RawDocketEntry[]> => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwDocketEntry as de')
        .selectAll('de')
        .where('de.docketNumber', 'in', openCases)
        .where('de.isLegacyServed', '=', true)
        .where('de.servedAt', '=', null)
        .orderBy('de.receivedAt', 'asc')
        .execute(),
    )
  ).map(fromKyselyDocketEntry) as RawDocketEntry[];
};

const outputCSV = ({
  docketEntriesMissingServiceDateInOpenCases,
}: {
  docketEntriesMissingServiceDateInOpenCases: RawDocketEntry[];
}): void => {
  const filename = `${OUTPUT_DIR}/docs-missing-service-date.csv`;
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Index', key: 'index' },
    { header: 'Event Code', key: 'eventCode' },
    { header: 'Document Type', key: 'documentType' },
  ];
  generateCsv({
    columns,
    filename,
    rows: docketEntriesMissingServiceDateInOpenCases,
  });
  console.log(`Generated ${filename}`);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const openCases = await getDocketNumbersOfAllOpenCases();
  const docketEntriesMissingServiceDateInOpenCases =
    await getDocketEntriesMissingServiceDate({ openCases });
  const uniqueCases = Array.from(
    new Set(
      docketEntriesMissingServiceDateInOpenCases.map(de => de.docketNumber),
    ),
  );
  console.log(
    `Found ${docketEntriesMissingServiceDateInOpenCases.length} docket ` +
      `entries missing service date across ${uniqueCases.length} open cases.`,
  );
  outputCSV({ docketEntriesMissingServiceDateInOpenCases });
})();
