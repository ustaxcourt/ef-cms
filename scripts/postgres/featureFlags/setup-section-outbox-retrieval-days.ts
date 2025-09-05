#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupSectionOutboxRetrievalDaysFlag() {
  const VALUE = 5;

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      { name: 'section-outbox-number-of-days', value: { current: VALUE } },
    ],
    onConflictColumns: ['name'],
  });
}

void setupSectionOutboxRetrievalDaysFlag();
