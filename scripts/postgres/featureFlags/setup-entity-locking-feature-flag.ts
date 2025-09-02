#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupEntityLockingFeatureFlag() {
  const VALUE = true;

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'e-consent-fields-enabled-feature-flag',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupEntityLockingFeatureFlag();
