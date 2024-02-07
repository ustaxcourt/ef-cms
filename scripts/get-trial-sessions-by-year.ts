// usage: npx ts-node --transpile-only ./scripts/get-trial-sessions-by-year.ts 2023 > ~/Desktop/2023-trial-sessions.csv

import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { createApplicationContext } from '@web-api/applicationContext';

const year = process.argv[2] || '2022';
const start = `${year}-01-01T05:00:00Z`;
const end = `${Number(year) + 1}-01-01T05:00:00Z`;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  const trialSessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({
      applicationContext,
    });

  const yearSessions = trialSessions.filter(
    session =>
      session.startDate &&
      session.startDate >= start &&
      session.startDate <= end,
  );
  yearSessions.sort((a, b) => a.startDate.localeCompare(b.startDate));

  console.log(
    'Start Date,Location,Session Type,Proceeding Type,Judge,Trial Clerk',
  );
  for (const s of yearSessions) {
    const startDate = formatDateString(s.startDate, FORMATS['MMDDYYYY_DASHED']);
    let trialClerk = '';
    if (s.trialClerk && 'name' in s.trialClerk && s.trialClerk.name) {
      trialClerk = s.trialClerk.name;
    } else if (s.alternateTrialClerkName) {
      trialClerk = s.alternateTrialClerkName;
    }
    console.log(
      `"${startDate}","${s.trialLocation}","${s.sessionType}","${s.proceedingType}","${s.judge?.name}","${trialClerk}"`,
    );
  }
})();
