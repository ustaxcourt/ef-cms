#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupNewTrialCities() {
  const VALUE = false;

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'new-trial-cities',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupNewTrialCities();
