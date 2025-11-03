#!/usr/bin/env -S npx ts-node --transpile-only

import { CLOSED_CASE_STATUSES } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
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

type slimDocketEntry = {
  docketNumber: string;
  documentType: string | null;
  eventCode: string;
  index: number | null;
};

const getDocketEntriesMissingServiceDateInOpenCases = async (): Promise<
  slimDocketEntry[]
> => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .innerJoin('dwDocketEntry as de', 'de.docketNumber', 'c.docketNumber')
      .select([
        'de.docketNumber',
        'de.documentType',
        'de.eventCode',
        'de.index',
      ])
      .where('c.status', 'not in', CLOSED_CASE_STATUSES)
      .where('de.isLegacyServed', '=', true)
      .where('de.servedAt', 'is', null)
      .orderBy('de.receivedAt', 'asc')
      .execute(),
  );
};

const outputCSV = ({
  docketEntries,
}: {
  docketEntries: slimDocketEntry[];
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
    rows: docketEntries.map(de => ({
      ...de,
      documentType: de.documentType || '',
      index: `${de.index}` || '',
    })),
  });
  console.log(`Generated ${filename}`);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const docketEntries = await getDocketEntriesMissingServiceDateInOpenCases();
  const uniqueCases = [...new Set(docketEntries.map(de => de.docketNumber))];
  console.log(
    `Found ${docketEntries.length} docket entries missing ` +
      `service date across ${uniqueCases.length} open cases.`,
  );
  outputCSV({ docketEntries });
})();
