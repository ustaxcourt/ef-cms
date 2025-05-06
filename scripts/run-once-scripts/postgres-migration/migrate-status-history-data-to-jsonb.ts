#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { environment } from '@web-api/environment';
import { CompiledQuery } from 'kysely';
import { CaseStatusChange } from '@shared/business/entities/cases/Case';
// import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

const scriptConfig: ScriptConfig = {
  description:
    'Migrate status history from dw_case_status_update to jsonb on dw_case ',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const pageSize = 10000; // An arbitrary but empirically well-performing number

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getStatusUpdatesPerCase = async (offset: number) => {
  return getDbReader(db =>
    db.executeQuery<{ docketNumber: string; statuses: CaseStatusChange[] }>(
      CompiledQuery.raw(
        `SELECT s.docket_number, array_to_json(array_agg(s order by s.date asc)) AS statuses FROM dw_case_status_update s GROUP BY s.docket_number ORDER BY s.docket_number LIMIT ${pageSize} offset ${offset};`,
        [],
      ),
    ),
  );
};

let totalCasesMigrated = 0;

async function main() {
  let offset = 0;
  let aggregatedStatuses = await getStatusUpdatesPerCase(offset);

  while (!isEmpty(aggregatedStatuses.rows)) {
    const statusesPerCase = aggregatedStatuses.rows.map(row => ({
      statuses: row.statuses,
      docketNumber: row.docketNumber,
    }));
    await getDbReader(db =>
      db.executeQuery(
        CompiledQuery.raw(
          `
          INSERT INTO dw_case (docket_number, case_status_history)
          SELECT elem->>'docketNumber' AS docket_number, elem->'statuses' AS case_status_history FROM jsonb_array_elements($1::jsonb) AS elem
          ON CONFLICT (docket_number) DO UPDATE
          SET case_status_history = EXCLUDED.case_status_history;
          `,
          [JSON.stringify(statusesPerCase)],
        ),
      ),
    );
    offset += pageSize;
    totalCasesMigrated += aggregatedStatuses.rows.length;
    console.log(
      `Migrated the case status history on ${totalCasesMigrated} cases`,
    );
    aggregatedStatuses = await getStatusUpdatesPerCase(offset);
  }
}

main().catch(console.error);
