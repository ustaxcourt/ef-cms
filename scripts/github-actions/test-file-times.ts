#!/usr/bin/env -S npx ts-node --transpile-only

import { testFileTimes } from './test-file-times.helpers';

if (require.main === module) {
  const args = process.argv.slice(2);
  testFileTimes(args);
}
