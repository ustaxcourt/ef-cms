#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupUseChangeOfAddressLambdaFlag() {
  const VALUE = true;

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      { name: 'use-change-of-address-lambda', value: { current: VALUE } },
    ],
    onConflictColumns: ['name'],
  });
}

void setupUseChangeOfAddressLambdaFlag();
