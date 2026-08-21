#!/usr/bin/env -S npx ts-node --transpile-only

import { RawUser } from '@shared/business/entities/User';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { createOrUpdateUser } from '../../shared/admin-tools/user/admin';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import {
  ACCOUNT_STATUS,
  Role,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { getUniqueId } from '@shared/sharedAppContext';
import pLimit from 'p-limit';
import { settlePromises } from '@web-api/utilities/settlePromises';

const scriptConfig: ScriptConfig = {
  description: 'setup-test-users - Creates test users.',
  environment: {
    password: 'DEFAULT_ACCOUNT_PASS',
  },
  preventExecutionAgainst: ['prod'],
  requireActiveAwsSession: true,
};
const { password } = parseArgsAndEnvVars(scriptConfig) as {
  [k: string]: string;
};

const CONCURRENCY_LIMIT = 25;
const limit = pLimit(CONCURRENCY_LIMIT);
const accounts: Promise<any>[] = [];

const createManyAccounts = (
  applicationContext: ServerApplicationContext,
  [num, role, section]: [number, Role, string],
) => {
  for (let i = 1; i <= num; i++) {
    const email =
      role === 'chambers'
        ? `${section}${i}@example.com`
        : `${role}${i}@example.com`;

    const user: RawUser = {
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: 'domestic',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      email,
      name: `Test ${role}${i}`,
      role,
      section,
      accountStatus: ACCOUNT_STATUS.active,
      userId: getUniqueId(),
    };

    accounts.push(
      limit(() =>
        createOrUpdateUser(applicationContext, {
          password,
          setPasswordAsPermanent: true,
          user,
        }),
      ),
    );
  }
};

const setupCourtUsers = async (
  applicationContext: ServerApplicationContext,
) => {
  const userSet: Array<[number, Role, string]> = [
    [10, 'adc', 'adc'],
    [10, 'admissionsclerk', 'admissions'],
    [10, 'clerkofcourt', 'clerkofcourt'],
    [10, 'docketclerk', 'docket'],
    [10, 'petitionsclerk', 'petitions'],
    [10, 'trialclerk', 'trialClerks'],
    [5, 'caseServicesSupervisor', 'caseServicesSupervisor'],
    [2, 'floater', 'floater'],
    [2, 'general', 'general'],
    [2, 'reportersOffice', 'reportersOffice'],
    [5, 'chambers', 'ashfordsChambers'],
    [5, 'chambers', 'buchsChambers'],
    [5, 'chambers', 'cohensChambers'],
    [5, 'chambers', 'foleysChambers'],
    [5, 'chambers', 'kerrigansChambers'],
  ];

  for (let index = 0; index < userSet.length; index++) {
    const user = userSet[index];
    await createManyAccounts(applicationContext, user); // Not doing parallel because of cognito throttling
  }
};

const setupPetitioners = async (
  applicationContext: ServerApplicationContext,
) => {
  await createManyAccounts(applicationContext, [
    30,
    'petitioner',
    'petitioner',
  ]);
};

const setupPractitionerInformationArray = (
  barNumbers: string[],
  practiceType: string,
  role: Role,
  emailUsername?: string,
): {
  barNumber: string;
  emailUsername: string | undefined;
  practiceType: string;
  role: Role;
}[] => {
  return barNumbers.map((barNumber: string) => {
    return {
      barNumber,
      emailUsername,
      practiceType,
      role,
    };
  });
};

const setupPractitioners = (applicationContext: ServerApplicationContext) => {
  const PRACTICE_TYPES = {
    DOJ: 'DOJ',
    IRS: 'IRS',
    Private: 'Private',
  };

  const PRACTITIONER_ROLE = {
    IRS: 'irsPractitioner',
    PRIVATE: 'privatePractitioner',
  } as const;

  const privatePractitionersBarNumbers = [
    'PT1234',
    'PT5432',
    'PT1111',
    'PT2222',
    'PT3333',
    'PT4444',
    'PT5555',
    'PT6666',
    'PT7777',
    'PT8888',
  ];
  const privatePractitioners = setupPractitionerInformationArray(
    privatePractitionersBarNumbers,
    PRACTICE_TYPES.Private,
    PRACTITIONER_ROLE.PRIVATE,
  );

  const irsPractitionersBarNumbers = [
    'RT6789',
    'RT0987',
    'RT7777',
    'RT8888',
    'RT9999',
    'RT6666',
    'RT0000',
    'RT1111',
    'RT2222',
    'RT3333',
  ];
  const irsPractitioners = setupPractitionerInformationArray(
    irsPractitionersBarNumbers,
    PRACTICE_TYPES.IRS,
    PRACTITIONER_ROLE.IRS,
  );

  const dojBarNumbers = ['DT1111', 'DT2222', 'DT3333'];
  const dojPractitioners = setupPractitionerInformationArray(
    dojBarNumbers,
    PRACTICE_TYPES.DOJ,
    PRACTITIONER_ROLE.IRS,
    'dojPractitioner',
  );

  const practitioners = [
    privatePractitioners,
    irsPractitioners,
    dojPractitioners,
  ];

  for (let i = 0; i < practitioners.length; i++) {
    const practitionerArray = practitioners[i];
    for (let j = 0; j < practitionerArray.length; j++) {
      const { barNumber, emailUsername, practiceType, role } =
        practitionerArray[j];

      const email = `${emailUsername || role}${j + 1}@example.com`;
      const user: RawPractitioner = {
        admissionsDate: '2019-03-01',
        admissionsStatus: 'Active',
        barNumber,
        birthYear: 1950,
        contact: {
          address1: '234 Main St',
          address2: 'Apartment 4',
          address3: 'Under the stairs',
          city: 'Chicago',
          countryType: 'domestic',
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        email,
        accountStatus: ACCOUNT_STATUS.active,
        firmName: 'Some Firm',
        firstName: `${emailUsername || role} ${j + 1}`,
        lastName: 'Test',
        name: `Test ${emailUsername || role}${j + 1}`,
        originalBarState: 'WA',
        practiceType,
        practitionerType: 'Attorney',
        userId: getUniqueId(),
        role,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        section: role,
        suffix: '',
      };

      accounts.push(
        limit(() =>
          createOrUpdateUser(applicationContext, {
            password,
            setPasswordAsPermanent: true,
            user,
          }),
        ),
      );
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  console.log('== Creating Court Users');
  await setupCourtUsers(applicationContext);

  console.log('== Creating Petitioners');
  await setupPetitioners(applicationContext);

  console.log('== Creating Practitioners');
  await setupPractitioners(applicationContext);

  await settlePromises(accounts);
  console.log('== Done!');
})();
