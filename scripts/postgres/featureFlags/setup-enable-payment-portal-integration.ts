#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupEnablePaymentPortalIntegration() {
  const VALUE = true;

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'enable-payment-portal-integration',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupEnablePaymentPortalIntegration();
