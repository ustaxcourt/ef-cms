#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../helpers/parseArgsAndEnvVars';
import { formatJudgeName } from '../helpers/formatters';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/persistence/postgres/database';
import {
  ACCOUNT_STATUS,
  CLOSED_CASE_STATUSES,
  ROLES,
} from '@shared/business/entities/EntityConstants';

const scriptConfig: ScriptConfig = {
  description:
    'firms-by-judge - Generates a CSV of firms representing petitioners ' +
    'in all open cases assigned to a given Judge',
  environment: {
    env: 'ENV',
  },
  parameters: {
    judgeName: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { judgeName } = parseArgsAndEnvVars(scriptConfig) as {
  judgeName: string;
};

type PractitionersCase = {
  associatedJudge: string;
  caption: string;
  docketNumber: string;
  firmName?: string;
  name: string;
  status: string;
};

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const outputCsv = ({
  practitionersCases,
}: {
  practitionersCases: PractitionersCase[];
}) => {
  const judge = formatJudgeName(practitionersCases[0].associatedJudge);
  const columns = [
    { header: 'Firm', key: 'firmName' },
    { header: 'Practitioner', key: 'name' },
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Judge', key: 'judge' },
    { header: 'Case Status', key: 'status' },
    { header: 'Case Title', key: 'caption' },
  ];
  const filename = `${OUTPUT_DIR}/firms-representing-petitioners-in-${judge}s-cases.csv`;
  const rows = practitionersCases.map(pc => ({
    ...pc,
    judge: formatJudgeName(pc.associatedJudge),
  }));
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
};

const retrievePractitionersInJudgesCases = async ({
  judgeName,
}: {
  judgeName: string;
}): Promise<PractitionersCase[]> => {
  return (await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .leftJoin('dwUserOnCase as uc', 'c.docketNumber', 'uc.docketNumber')
      .leftJoin('dwUser as u', 'uc.userId', 'u.userId')
      .select([
        'c.associatedJudge',
        'c.caption',
        'c.docketNumber',
        'c.status',
        'u.firmName',
        'u.name',
      ])
      .where('c.associatedJudge', '=', judgeName)
      .where('c.status', 'not in', CLOSED_CASE_STATUSES)
      .where('u.accountStatus', '=', ACCOUNT_STATUS.active)
      .where('u.firmName', 'is not', null)
      .where('u.firmName', '!=', '')
      .where('u.role', '=', ROLES.privatePractitioner)
      .orderBy('c.sortableDocketNumber', 'asc')
      .execute(),
  )) as PractitionersCase[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const practitionersCases = await retrievePractitionersInJudgesCases({
    judgeName,
  });
  outputCsv({ practitionersCases });
})();
