#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupAllowIdpLoginFlag() {
  const VALUE = true;

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'allow-idp-login',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupAllowIdpLoginFlag();
