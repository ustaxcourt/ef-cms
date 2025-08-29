#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

async function setupTerminalIpAllowlistFlag() {
  const VALUE = [];

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [{ name: 'allowed-terminal-ips', value: { current: VALUE } }],
    onConflictColumns: ['name'],
  });
}

void setupTerminalIpAllowlistFlag();
