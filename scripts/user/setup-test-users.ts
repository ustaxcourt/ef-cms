import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { createOrUpdateUser } from '../../shared/admin-tools/user/admin';
import { environment } from '@web-api/environment';
import {
  getDestinationTableName,
  getUserPoolId,
  requireEnvVars,
} from '../../shared/admin-tools/util';

requireEnvVars(['DEFAULT_ACCOUNT_PASS', 'USTC_ADMIN_PASS', 'USTC_ADMIN_USER']);

const { DEFAULT_ACCOUNT_PASS } = process.env;

const createManyAccounts = async (
  applicationContext: ServerApplicationContext,
  [num, role, section]: [number, string, string],
) => {
  for (let i = 1; i <= num; i++) {
    const email =
      role === 'chambers'
        ? `${section}${i}@example.com`
        : `${role}${i}@example.com`;

    const user = {
      birthYear: '1950',
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
      employer: '',
      lastName: 'Test',
      name: `Test ${role}${i}`,
      role,
      section,
      suffix: '',
    };

    await createOrUpdateUser(applicationContext, {
      password: DEFAULT_ACCOUNT_PASS!,
      user,
    });
  }
};

const setupCourtUsers = async (
  applicationContext: ServerApplicationContext,
) => {
  const userSet: Array<[number, string, string]> = [
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

  const promises = userSet.map(user =>
    createManyAccounts(applicationContext, user),
  );
  await Promise.all(promises);
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

const setupPractitioners = async (
  applicationContext: ServerApplicationContext,
) => {
  const practitioners = {
    irsPractitioner: [
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
    ],
    privatePractitioner: [
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
    ],
  };

  for (let role in practitioners) {
    const promises = practitioners[role].map((barNumber, i) => {
      const employer = role === 'privatePractitioner' ? 'Private' : 'IRS';
      const email = `${role}${i + 1}@example.com`;
      const user = {
        admissionsDate: '2019-03-01',
        admissionsStatus: 'Active',
        barNumber,
        birthYear: '1950',
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
        employer,
        firmName: 'Some Firm',
        firstName: `${role} ${i + 1}`,
        lastName: 'Test',
        name: `Test ${role}${i + 1}`,
        originalBarState: 'WA',
        password: DEFAULT_ACCOUNT_PASS,
        practitionerType: 'Attorney',
        role,
        section: role,
        suffix: '',
      };

      return createOrUpdateUser(applicationContext, {
        password: DEFAULT_ACCOUNT_PASS!,
        user,
      });
    });

    await Promise.all(promises);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const userPoolId = await getUserPoolId();
  const destinationTable = await getDestinationTableName();
  environment.userPoolId = userPoolId;
  environment.dynamoDbTableName = destinationTable;
  const applicationContext = createApplicationContext({});

  console.log('== Creating Court Users');
  await setupCourtUsers(applicationContext);

  console.log('== Creating Petitioners');
  await setupPetitioners(applicationContext);

  console.log('== Creating Practitioners');
  await setupPractitioners(applicationContext);

  console.log('== Done!');
})();
