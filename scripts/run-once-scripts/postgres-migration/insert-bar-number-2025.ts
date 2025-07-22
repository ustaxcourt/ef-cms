#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { getConnection } from '@web-api/getConnection';
import { sql } from 'kysely';

const scriptConfig: ScriptConfig = {
  description:
    'move-petitioners-out-of-case - Moves the petitioners array into a separate table',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const YEAR_TO_INSERT = '2025';

async function main() {
  const barNumbers = await getDbReader(reader =>
    reader
      .selectFrom('dwUser')
      .select([
        sql<string>`SUBSTRING("bar_number", 3, 2)`.as('year'),
        sql<number>`MAX(CAST(SUBSTRING("bar_number", 5) AS INTEGER))`.as(
          'maxSequence',
        ),
      ])
      .where('barNumber', 'is not', null)
      .where(
        sql`SUBSTRING("bar_number", 3, 2) = ${YEAR_TO_INSERT.substring(2)}`,
      )
      .groupBy(sql`year`)
      .executeTakeFirst(),
  );

  const lastUsedNumber = barNumbers?.maxSequence ?? 1;

  await getConnection({
    cb: db =>
      db
        .insertInto('dwBarNumber')
        .values({
          year: YEAR_TO_INSERT,
          lastUsedNumber,
        })
        .onConflict(oc =>
          oc.columns(['year']).doUpdateSet(eb => ({
            year: eb.ref('excluded.year'),
            lastUsedNumber: eb.ref('excluded.lastUsedNumber'),
          })),
        )
        .returningAll()
        .execute(),
  });
}

main().catch(console.error);
