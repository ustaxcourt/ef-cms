#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { createApplicationContext } from '@web-api/applicationContext';
import { faker } from '@faker-js/faker';
import { getSpecialSessionsInTerm } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const scriptConfig: ScriptConfig = {
  description:
    'temp-get-special-trial-sessions - Fetches test data for special trial sessions.',
  environment: {
    dynamoDbTableName: 'DYNAMODB_TABLE_NAME',
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

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
      caseOrder: [
        {
          addedToSessionAt: '2024-04-09T14:06:21.318Z',
          calendarNotes: 'This is a case note.',
          docketNumber: `${counter}-24`,
          isManuallyAdded: true,
        },
      ],
      judge: {
        name: faker.person.lastName(),
        userId: uuidv4(),
      },
      trialClerk: {
        name: `${faker.person.firstName()} ${faker.person.lastName()}`,
        userId: uuidv4(),
      },
    };
  });

  console.log(sanitizedFilteredSessions.length);
  fs.writeFileSync(
    './shared/src/test/mockSpecialTrialSessions.json',
    JSON.stringify(sanitizedFilteredSessions, null, 2),
  );
})();
