#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupDocumentVisibilityPolicyChangeDate() {
  const VALUE = '2023-08-01';

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'document-visibility-policy-change-date',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupDocumentVisibilityPolicyChangeDate();
