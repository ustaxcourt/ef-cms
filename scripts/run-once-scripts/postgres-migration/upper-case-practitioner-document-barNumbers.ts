#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbWriter } from '@web-api/database';
import { sql, SqlBool } from 'kysely';

const scriptConfig: ScriptConfig = {
  description:
    'upper-case-practitioner-document-barNumbers - Fix practitioner document data created with lower-cased bar numbers',
  environment: {
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};

parseArgsAndEnvVars(scriptConfig);

async function main() {
  await getDbWriter({
    cb: writer =>
      writer
        .updateTable('dwPractitionerDocuments')
        .set({ barNumber: sql`UPPER("bar_number")` })
        .where(sql<SqlBool>`regexp_like("bar_number", '^[a-z]{2}[0-9]{4}$')`)
        .execute(),
    table: 'dwPractitionerDocuments',
    action: null,
  });

  console.log('Done updating practitioner documents');
}

void main();
