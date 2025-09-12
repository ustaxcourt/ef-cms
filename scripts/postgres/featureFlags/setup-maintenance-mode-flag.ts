#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupMaintenanceMode() {
  const VALUE = false;

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'maintenance-mode',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupMaintenanceMode();
