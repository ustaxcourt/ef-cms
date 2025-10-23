#!/usr/bin/env -S npx ts-node --transpile-only

import type { RawPractitioner } from '@shared/business/entities/Practitioner';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
  getJsTimeframeForYear,
} from '../helpers/parseArgsAndEnvVars';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/database';
import { getNowObject } from '@shared/business/utilities/DateHandler';
import { pick } from 'lodash';

const thisYear = getNowObject().year;
const scriptConfig: ScriptConfig = {
  description:
    'documents-filed-by-non-attorneys - Generates a CSV of documents filed by non-attorneys.',
  environment: {
    env: 'ENV',
  },
  parameters: {
    eventCode: {
      default: 'P',
      long: 'event-code',
      required: false,
      short: 'e',
      type: 'string',
    },
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    year: {
      default: `${thisYear}`,
      required: false,
      short: 'y',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { eventCode, fiscal, year } = parseArgsAndEnvVars(scriptConfig) as {
  eventCode: string;
  fiscal: boolean;
  year: string;
};
const { begin, end } = getJsTimeframeForYear({ fiscal, year });

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const getNonAttorneys = async (): Promise<{ [k: string]: string }> => {
  const nonAttorneys = {};
  const results = (
    await getDbReader(reader =>
      reader
        .selectFrom('dwUser as u')
        .selectAll('u')
        .where('u.admissionsStatus', '=', 'Active')
        .where('u.practitionerType', '=', 'Non-Attorney')
        .orderBy('u.admissionsDate', 'asc')
        .execute(),
    )
  ).map(fromKyselyUser) as RawPractitioner[];
  for (const result of results) {
    nonAttorneys[result.userId] = result.name;
  }
  return nonAttorneys;
};

const getDocuments = async ({
  eventCode,
  userIds,
}: {
  eventCode: string;
  userIds: string[];
}): Promise<RawDocketEntry[]> => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwDocketEntry as de')
        .selectAll('de')
        .where('de.eventCode', '=', eventCode)
        .where('de.userId', 'in', userIds)
        .where('de.receivedAt', '>=', begin)
        .where('de.receivedAt', '<', end)
        .orderBy('de.receivedAt', 'asc')
        .execute(),
    )
  ).map(fromKyselyDocketEntry) as RawDocketEntry[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  console.log(
    `Looking for documents with event code ${eventCode} filed by non-attorneys ` +
      `in ${fiscal ? 'fiscal' : 'calendar'} year ${year}...`,
  );
  const nonAttorneys = await getNonAttorneys();
  console.log(
    `Found ${Object.keys(nonAttorneys).length} non-attorneys with active admissions status.`,
  );
  const documents = await getDocuments({
    eventCode,
    userIds: Object.keys(nonAttorneys),
  });
  if (!documents.length) {
    console.log(
      `Found 0 documents with event code ${eventCode} filed by non-attorneys ` +
        `in ${fiscal ? 'fiscal' : 'calendar'} year ${year}.`,
    );
    return;
  }
  console.log(
    `Found ${documents.length} ${documents[0].documentType}` +
      `${documents.length === 1 ? '' : 's'} filed by non-attorneys ` +
      `in ${fiscal ? 'fiscal' : 'calendar'} year ${year}.`,
  );
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Document Title', key: 'documentTitle' },
    { header: 'Filed On', key: 'filedOn' },
    { header: 'Filed By', key: 'filedBy' },
  ];
  const rows = documents.map(de => ({
    ...pick(de, ['docketNumber', 'documentTitle']),
    filedBy: nonAttorneys[de.userId!],
    filedOn: de.receivedAt.split('T')[0],
  }));
  const docType = documents[0].documentType?.replace(' ', '-').toLowerCase();
  const filename = `${OUTPUT_DIR}/${docType}s-filed-by-non-attorneys-in${fiscal ? '-fiscal-year' : ''}-${year}.csv`;
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
