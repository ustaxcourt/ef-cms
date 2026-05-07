#!/usr/bin/env -S npx ts-node --transpile-only

import { downloadHistoricalTestFileTimes } from './download-historical-test-file-times.helpers';

if (require.main === module) {
  void downloadHistoricalTestFileTimes();
}
