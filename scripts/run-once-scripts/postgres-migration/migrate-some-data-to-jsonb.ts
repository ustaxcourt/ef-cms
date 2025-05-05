#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { environment } from '@web-api/environment';
import { CompiledQuery } from 'kysely';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

const scriptConfig: ScriptConfig = {
  description:
    'Migrate petitioners from dw_petitioner_on_case to jsonb on dw_case ',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const pageSize = 10000;

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getPetitionersPerCase = async (offset: number) => {
  return getDbReader(db =>
    db.executeQuery<TPetitioner>(
      CompiledQuery.raw(
        `SELECT p.docket_number, array_to_json(array_agg(p order by p.order_on_case)) AS petitioners FROM dw_petitioner_on_case p GROUP BY p.docket_number ORDER BY p.docket_number LIMIT ${pageSize} offset ${offset};`,
        [],
      ),
    ),
  );
};

let totalCasesMigrated = 0;

async function main() {
  let offset = 0;
  let aggregatedPetitioners = await getPetitionersPerCase(offset);

  while (!isEmpty(aggregatedPetitioners.rows)) {
    const petitionersPerCase = aggregatedPetitioners.rows.map(p => ({
      ...transformNullToUndefined(p),
      state: p.state ?? null,
    }));
    await getDbReader(db =>
      db.executeQuery(
        CompiledQuery.raw(
          `
          INSERT INTO dw_case_clone (docket_number, petitioners)
          SELECT
            rec.docket_number,
            rec.petitioners
          FROM
            jsonb_to_recordset($1::jsonb) AS rec(docket_number text, petitioners jsonb)
          ON CONFLICT (docket_number) DO UPDATE
            SET petitioners = EXCLUDED.petitioners;
          `,
          [JSON.stringify(petitionersPerCase)],
        ),
      ),
    );
    offset += pageSize;
    totalCasesMigrated += aggregatedPetitioners.rows.length;
    console.log(`Migrated the petitioners on ${totalCasesMigrated} cases`);
    aggregatedPetitioners = await getPetitionersPerCase(offset);
  }
}

main().catch(console.error);
