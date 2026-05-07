#!/usr/bin/env -S npx ts-node --transpile-only

import { runCypressTestsWithTiming } from './run-cypress-tests-with-timing.helpers';

if (require.main === module) {
  void runCypressTestsWithTiming();
}
