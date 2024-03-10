/*
  Outputs a trial sessions report

    usage:
      $ npx ts-node --transpile-only scripts/reports/trial-sessions-by-fiscal-year.ts 2023 > ~/Desktop/FY2023-trial-sessions.csv
      $ npx ts-node --transpile-only scripts/reports/trial-sessions-by-fiscal-year.ts 2023 --stats
 */

import { createApplicationContext } from '@web-api/applicationContext';
import { trialSessionsReport } from './trial-sessions-report-helpers';

const year = process.argv[2] || '2023';
const start = `${Number(year) - 1}-10-01T04:00:00Z`;
const end = `${year}-09-30T04:00:00Z`;
const stats = !!process.argv[3] && process.argv[3] === '--stats';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  await trialSessionsReport({ applicationContext, end, start, stats });
})();
