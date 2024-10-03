import { createApplicationContext } from '@web-api/applicationContext';
import { getSpecialSessionsInTerm } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { requireEnvVars } from '../../shared/admin-tools/util';
import fs from 'fs';

requireEnvVars(['ENV']);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext();

  const sessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({ applicationContext });

  const filteredSessions = getSpecialSessionsInTerm({
    sessions,
    termEndDate: '2024-12-31T04:00:00.000Z',
    termStartDate: '2019-09-01T04:00:00.000Z',
  });

  console.log(filteredSessions);
  fs.writeFileSync(
    './shared/src/test/mockSpecialTrialSessions.json',
    JSON.stringify(filteredSessions, null, 2),
  );
})();
