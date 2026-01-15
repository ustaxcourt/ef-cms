#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupUndoRestrictedEventCodes() {
  const VALUE = '';

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'restricted-event-codes',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupUndoRestrictedEventCodes();
