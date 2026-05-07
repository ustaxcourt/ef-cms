#!/usr/bin/env -S npx ts-node --transpile-only

import { splitTestsGlob } from './split-tests.helpers';

if (require.main === module) {
  const testType: string = process.argv.slice(2)[0] || '';
  splitTestsGlob(testType);
}
