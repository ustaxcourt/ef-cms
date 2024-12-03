import { createApplicationContext } from '@web-api/applicationContext';
import { getSpecialSessionsInTerm } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { requireEnvVars } from '../../shared/admin-tools/util';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

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
    termStartDate: '2024-09-01T04:00:00.000Z',
  });

  let counter = 100;
  const sanitizedFilteredSessions = filteredSessions.map(session => {
    counter++;
    return {
      ...session,
      judge: {
        name: faker.person.lastName(),
        userId: uuidv4(),
      },
      trialClerk: {
        name: `${faker.person.firstName()} ${faker.person.lastName()}`,
        userId: uuidv4(),
      },
      caseOrder: [
        {
          calendarNotes: 'This is a case note.',
          isManuallyAdded: true,
          addedToSessionAt: '2024-04-09T14:06:21.318Z',
          docketNumber: `${counter}-24`,
        },
      ],
    };
  });

  console.log(sanitizedFilteredSessions.length);
  fs.writeFileSync(
    './shared/src/test/mockSpecialTrialSessions.json',
    JSON.stringify(sanitizedFilteredSessions, null, 2),
  );
})();
