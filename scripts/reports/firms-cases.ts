#!/usr/bin/env -S npx ts-node --transpile-only

import type { RawPractitioner } from '@shared/business/entities/Practitioner';
import { formatCaseCaption, formatJudgeName } from '../helpers/formatters';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/database';
import { pick } from 'lodash';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV']);

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const firmTerms: string[] = process.argv.slice(2);
if (!firmTerms.length) {
  console.error('usage: scripts/reports/find-firms-cases.ts Firm Search Terms');
  process.exit(1);
}

const getFirmsPractitioners = async (): Promise<RawPractitioner[]> => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwUser as u')
        .selectAll('u')
        .where('u.admissionsStatus', '=', 'Active')
        .where('u.role', '=', 'privatePractitioner')
        .where(eb =>
          eb.and(firmTerms.map(term => eb('u.firmName', 'ilike', `%${term}%`))),
        )
        .orderBy('u.admissionsDate', 'asc')
        .execute(),
    )
  ).map(fromKyselyUser) as RawPractitioner[];
};

const getFirmsCases = async ({
  firmsPractitionerIds,
}: {
  firmsPractitionerIds: string[];
}): Promise<RawCase[]> => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwCase as c')
        .leftJoin('dwUserOnCase as uc', 'c.docketNumber', 'uc.docketNumber')
        .selectAll('c')
        .where('uc.userId', 'in', firmsPractitionerIds)
        .where('uc.actingAsRole', '=', 'privatePractitioner')
        .orderBy('c.sortableDocketNumber', 'asc')
        .execute(),
    )
  ).map(fromKyselyCase) as RawCase[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const firmsPractitionerIds = (await getFirmsPractitioners()).map(
    p => p.userId,
  );
  const firmsCases = await getFirmsCases({
    firmsPractitionerIds,
  });
  const filename = `${OUTPUT_DIR}/${firmTerms.map(ft => ft.toLowerCase()).join('-')}-cases.csv`;
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Judge', key: 'judge' },
    { header: 'Case Status', key: 'status' },
    { header: 'Case Title', key: 'caseCaption' },
  ];
  const rows = firmsCases.map(fc => ({
    ...pick(fc, ['docketNumber', 'status']),
    caseCaption: formatCaseCaption(fc.caseCaption),
    judge: formatJudgeName(fc.associatedJudge),
  }));
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
