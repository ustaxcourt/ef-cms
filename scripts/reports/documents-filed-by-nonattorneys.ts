#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
  getJsTimeframeForYear,
} from '../helpers/parseArgsAndEnvVars';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/database';
import { getNowObject } from '@shared/business/utilities/DateHandler';
import { pick } from 'lodash';
import { formatDate } from '../helpers/formatters';

const thisYear = getNowObject().year;
const scriptConfig: ScriptConfig = {
  description:
    'documents-filed-by-non-attorneys - Generates a CSV of documents filed by non-attorneys.',
  environment: {
    env: 'ENV',
  },
  parameters: {
    eventCode: {
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

type NonAttorneyFiledDocketEntry = {
  docketNumber: string;
  documentTitle: string;
  documentType: string;
  name: string;
  receivedAt: Date;
};

const getDocumentsFiledByNonAttorneys = async (): Promise<
  NonAttorneyFiledDocketEntry[]
> => {
  return (await getDbReader(reader => {
    let query = reader
      .selectFrom('dwDocketEntry as de')
      .leftJoin('dwUser as u', 'de.userId', 'u.userId')
      .select([
        'de.docketNumber',
        'de.documentTitle',
        'de.documentType',
        'de.receivedAt',
        'u.name',
      ]);
    if (eventCode) {
      query = query.where('de.eventCode', '=', eventCode);
    }
    return query
      .where('de.receivedAt', '>=', begin)
      .where('de.receivedAt', '<', end)
      .where('u.admissionsStatus', '=', 'Active')
      .where('u.practitionerType', '=', 'Non-Attorney')
      .orderBy('de.receivedAt', 'asc')
      .execute();
  })) as NonAttorneyFiledDocketEntry[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const documents = await getDocumentsFiledByNonAttorneys();
  let message = `Found ${documents.length} `;
  message += eventCode
    ? `${documents[0].documentType}${documents.length === 1 ? '' : 's'}`
    : 'documents';
  message +=
    `filed by non-attorneys in ${fiscal ? 'fiscal' : 'calendar'} ` +
    `year ${year}.`;
  console.log(message);
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Document Title', key: 'documentTitle' },
    { header: 'Filed On', key: 'filedOn' },
    { header: 'Filed By', key: 'filedBy' },
  ];
  const rows = documents.map(de => ({
    ...pick(de, ['docketNumber', 'documentTitle']),
    filedBy: de.name,
    filedOn: formatDate(de.receivedAt),
  }));
  const docType = eventCode
    ? documents[0].documentType?.replace(' ', '-').toLowerCase()
    : 'all-document';
  const filename =
    `${OUTPUT_DIR}/${docType}s-filed-by-non-attorneys-in` +
    `${fiscal ? '-fy' : ''}-${year}.csv`;
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
