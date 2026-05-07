#!/usr/bin/env -S npx ts-node --transpile-only

import { downloadHistoricalTestFileTimes } from './download-historical-test-file-times.helpers';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await downloadHistoricalTestFileTimes();
})();
