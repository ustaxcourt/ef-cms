#!/usr/bin/env -S npx ts-node --transpile-only

import { runCypressTestsWithTiming } from './run-cypress-tests-with-timing.helpers';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await runCypressTestsWithTiming();
})();
