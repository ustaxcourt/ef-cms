/*
  Outputs a trial sessions report

    usage:
      $ npx ts-node --transpile-only scripts/reports/trial-sessions-by-calendar-year.ts 2023 > ~/Desktop/2023-trial-sessions.csv
      $ npx ts-node --transpile-only scripts/reports/trial-sessions-by-calendar-year.ts 2023 --stats
 */

import { createApplicationContext } from '@web-api/applicationContext';
import { trialSessionsReport } from './trial-sessions-report-helpers';

const year = process.argv[2] || '2023';
const start = `${year}-01-01T05:00:00Z`;
const end = `${Number(year) + 1}-01-01T05:00:00Z`;
const stats = !!process.argv[3] && process.argv[3] === '--stats';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  await trialSessionsReport({ applicationContext, end, start, stats });
})();
