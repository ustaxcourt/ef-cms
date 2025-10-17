#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupAwsBatchZipperMinimumCount() {
  const VALUE = 50;

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'aws-batch-zipper-minimum-count',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupAwsBatchZipperMinimumCount();
