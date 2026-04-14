#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  getJsTimeframeForYear,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { formatDate } from '../helpers/formatters';

const scriptConfig: ScriptConfig = {
  description:
    'lea-stats - Generates statistics related to Limited Entry of Appearance documents.',
  environment: {
    env: 'ENV',
  },
  parameters: {
    fiscal: {
      short: 'f',
      type: 'boolean',
    },
    year: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { fiscal, year } = parseArgsAndEnvVars(scriptConfig) as {
  fiscal: boolean;
  year: string;
};
const { begin, end } = getJsTimeframeForYear({ fiscal, year });

const OUTPUT_DIR = `${process.env.HOME}/Documents`;
const caseCache: { [k: string]: Omit<RawCase, 'consolidatedCases'> } = {};

const getLEAsFiledInYear = async (): Promise<RawDocketEntry[]> => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwDocketEntry as de')
        .selectAll('de')
        .where('de.eventCode', '=', 'LEA')
        .where('de.receivedAt', '>=', begin)
        .where('de.receivedAt', '<', end)
        .orderBy('de.receivedAt', 'asc')
        .execute(),
    )
  ).map(fromKyselyDocketEntry) as RawDocketEntry[];
};

const getNocFiledAfterLeaInCase = ({
  docketNumber,
  leaReceivedAt,
}: {
  docketNumber: string;
  leaReceivedAt: string;
}): RawDocketEntry | undefined => {
  if (!(docketNumber in caseCache)) {
    return;
  }
  const subsequentNOCs = caseCache[docketNumber].docketEntries.filter(de => {
    return de.eventCode === 'NOC' && de.receivedAt > leaReceivedAt;
  });
  if (!subsequentNOCs) {
    return;
  }
  return subsequentNOCs[0];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const leas = await getLEAsFiledInYear();
  console.log(
    `Found ${leas.length} Limited Entry of Appearance documents filed in ` +
      `in ${fiscal ? 'fiscal' : 'calendar'} year ${year}.`,
  );
  const docketNumbers = [...new Set(leas.map(de => de.docketNumber))];

  const cases = await getCasesByDocketNumbers({ docketNumbers });
  cases.forEach(c => {
    caseCache[c.docketNumber] = c;
  });

  const procedureTypeAggs: { [k: string]: number } = {};
  for (const caseEntity of Object.values(caseCache)) {
    if (!(caseEntity.procedureType in procedureTypeAggs)) {
      procedureTypeAggs[caseEntity.procedureType] = 0;
    }
    procedureTypeAggs[caseEntity.procedureType]++;
  }
  const subsequentNocs: string[] = [];
  const rows: {}[] = [];
  for (const lea of leas) {
    const subsequentNoc = getNocFiledAfterLeaInCase({
      docketNumber: lea.docketNumber,
      leaReceivedAt: lea.receivedAt,
    });
    if (subsequentNoc && subsequentNoc.docketEntryId) {
      subsequentNocs.push(subsequentNoc.docketEntryId);
    }
    rows.push({
      docketNumber: lea.docketNumber,
      leaFiledDate: formatDate(lea.receivedAt),
      leaIndex: lea.index,
      nocFiledDate: formatDate(subsequentNoc?.receivedAt),
      nocIndex: subsequentNoc?.index ?? '',
      procedureType: caseCache[lea.docketNumber].procedureType,
    });
  }
  const uniqueSubsequentNocs = [...new Set(subsequentNocs)];
  const stats = {
    procedureTypeAggs,
    totalUniqueCases: 0,
    totalUniqueLeas: leas.length,
    totalUniqueSubsequentNocs: uniqueSubsequentNocs.length,
  };
  for (const pt in procedureTypeAggs) {
    stats.totalUniqueCases += procedureTypeAggs[pt];
  }

  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Procedure Type', key: 'procedureType' },
    { header: 'LEA Index', key: 'leaIndex' },
    { header: 'LEA Filed', key: 'leaFiledDate' },
    { header: 'Subsequent NOC Index', key: 'nocIndex' },
    { header: 'Subsequent NOC Filed', key: 'nocFiledDate' },
  ];
  const filename = `${OUTPUT_DIR}/leas-filed-in${fiscal ? '-fiscal-year' : ''}-${year}.csv`;
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
  console.log('\nStatistics:', stats);
})();
