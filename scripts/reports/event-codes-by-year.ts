#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type EventCodeReportDocketEntry,
  getDocketEntriesByEventCodesAndYears,
} from './event-codes-by-year-helpers';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { generateCsv } from '../helpers/generate-csv';
import { getNowObject } from '@shared/business/utilities/DateHandler';
import { pick } from 'lodash';
import {
  formatCaseCaption,
  formatDate,
  formatJudgeName,
} from '../helpers/formatters';

const thisYear = getNowObject().year;
const scriptConfig: ScriptConfig = {
  description:
    'event-codes-by-year - Generate a CSV of instances of documents with the ' +
    'given event code(s) filed within the given duration.',
  environment: {
    env: 'ENV',
  },
  parameters: {
    count: {
      default: false,
      short: 'c',
      type: 'boolean',
    },
    eventCodes: {
      commaDelimited: true,
      position: 0,
      required: true,
      transform: 'toUpperCase',
      type: 'string',
    },
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    groupConsolidated: {
      default: false,
      long: 'group-consolidated',
      short: 'g',
      type: 'boolean',
    },
    stricken: {
      default: false,
      short: 's',
      type: 'boolean',
    },
    years: {
      default: [`${thisYear}`],
      multiple: true,
      short: 'y',
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { count, eventCodes, fiscal, groupConsolidated, stricken, years } =
  parseArgsAndEnvVars(scriptConfig) as {
    count: boolean;
    eventCodes: string[];
    fiscal: boolean;
    groupConsolidated: boolean;
    stricken: boolean;
    years: number[];
  };

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const outputCsv = ({
  docketEntries,
}: {
  docketEntries: EventCodeReportDocketEntry[];
}) => {
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Date Filed', key: 'filed' },
    { header: 'Document Type', key: 'documentType' },
    { header: 'Judge', key: 'judge' },
    { header: 'Status', key: 'status' },
    { header: 'Case Title', key: 'caption' },
  ];
  const filename =
    `${OUTPUT_DIR}/${groupConsolidated ? 'distinct-' : ''}` +
    `${eventCodes.map(ec => ec.toLowerCase()).join('-')}-filed-` +
    `in-${fiscal ? 'fy-' : ''}${years.join('-')}.csv`;
  const rows = docketEntries.map(de => ({
    ...pick(de, ['docketNumber', 'documentType', 'status']),
    caption: formatCaseCaption(de.caption),
    filed: formatDate(de.receivedAt),
    judge: formatJudgeName(de.associatedJudge),
  }));
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  if (count) {
    const docCount: number = (await getDocketEntriesByEventCodesAndYears({
      count,
      eventCodes,
      fiscal,
      groupConsolidated,
      onlyNonStricken: !stricken,
      years,
    })) as number;
    console.log(
      `Found ${docCount} ${groupConsolidated ? 'distinct ' : ''}` +
        `${stricken ? '' : 'non-stricken '}` +
        `${eventCodes.join(',')} documents filed in ${fiscal ? 'fy ' : ''}` +
        `${years.join(',')}`,
    );
    return;
  }
  const docketEntries = (await getDocketEntriesByEventCodesAndYears({
    eventCodes,
    fiscal,
    groupConsolidated,
    onlyNonStricken: !stricken,
    years,
  })) as EventCodeReportDocketEntry[];
  console.log(
    `Found ${docketEntries.length} ${groupConsolidated ? 'distinct ' : ''}` +
      `${stricken ? '' : 'non-stricken '}${eventCodes.join(',')} documents ` +
      `filed in ${fiscal ? 'fy ' : ''}${years.join(',')}`,
  );
  outputCsv({ docketEntries });
})();
