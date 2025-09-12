#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupClerkOfCourtConfig() {
  const VALUE = {
    name: 'Charles G. Jeane',
    title: 'Clerk of the Court',
  };

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'clerk-of-court-configuration',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupClerkOfCourtConfig();
