#!/usr/bin/env -S npx ts-node --transpile-only

import { splitTestsCypress } from './split-tests.helpers';

// # Usage
// #   scripts/github-actions/split-tests-cypress.ts integration
// #   scripts/github-actions/split-tests-cypress.ts accessibility

// # Arguments
// #   - $1 - the folder of tests to include when looking for tests to split across action runners

if (require.main === module) {
  const testDir: string = process.argv.slice(2)[0] || '';
  splitTestsCypress(testDir);
}
