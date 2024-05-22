import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { createOrUpdateUser } from '../../shared/admin-tools/user/admin';
import { environment } from '@web-api/environment';
import {
  getDestinationTableInfo,
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
      lastName: 'Test',
      name: `Test ${role}${i}`,
      practiceType: '',
      role,
      section,
      suffix: '',
    };

    await createOrUpdateUser(applicationContext, {
      password: DEFAULT_ACCOUNT_PASS!,
      setPasswordAsPermanent: true,
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

const setupPractitioners = async (
  applicationContext: ServerApplicationContext,
) => {
  const privatePractitioners = [
    { barNumber: 'PT1234', role: 'privatePractitioner' },
    { barNumber: 'PT5432', role: 'privatePractitioner' },
    { barNumber: 'PT1111', role: 'privatePractitioner' },
    { barNumber: 'PT2222', role: 'privatePractitioner' },
    { barNumber: 'PT3333', role: 'privatePractitioner' },
    { barNumber: 'PT4444', role: 'privatePractitioner' },
    { barNumber: 'PT5555', role: 'privatePractitioner' },
    { barNumber: 'PT6666', role: 'privatePractitioner' },
    { barNumber: 'PT7777', role: 'privatePractitioner' },
    { barNumber: 'PT8888', role: 'privatePractitioner' },
  ];
  const irsPractitioners = [
    { barNumber: 'RT6789', role: 'irsPractitioner' },
    { barNumber: 'RT0987', role: 'irsPractitioner' },
    { barNumber: 'RT7777', role: 'irsPractitioner' },
    { barNumber: 'RT8888', role: 'irsPractitioner' },
    { barNumber: 'RT9999', role: 'irsPractitioner' },
    { barNumber: 'RT6666', role: 'irsPractitioner' },
    { barNumber: 'RT0000', role: 'irsPractitioner' },
    { barNumber: 'RT1111', role: 'irsPractitioner' },
    { barNumber: 'RT2222', role: 'irsPractitioner' },
    { barNumber: 'RT3333', role: 'irsPractitioner' },
  ];

  const practitioners = [privatePractitioners, irsPractitioners];
  for (let i = 0; i < practitioners.length; i++) {
    const practitionerArray = practitioners[i];
    for (let j = 0; j < practitionerArray.length; j++) {
      const { barNumber, role } = practitionerArray[j];

      const practiceType = role === 'privatePractitioner' ? 'Private' : 'IRS';
      const email = `${role}${j + 1}@example.com`;
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
        firmName: 'Some Firm',
        firstName: `${role} ${j + 1}`,
        lastName: 'Test',
        name: `Test ${role}${j + 1}`,
        originalBarState: 'WA',
        password: DEFAULT_ACCOUNT_PASS,
        practiceType,
        practitionerType: 'Attorney',
        role,
        section: role,
        suffix: '',
      };

      await createOrUpdateUser(applicationContext, {
        password: DEFAULT_ACCOUNT_PASS!,
        setPasswordAsPermanent: true,
        user,
      });
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const userPoolId = await getUserPoolId();
  const { tableName } = await getDestinationTableInfo();
  environment.userPoolId = userPoolId;
  environment.dynamoDbTableName = tableName;
  const applicationContext = createApplicationContext({});

  console.log('== Creating Court Users');
  await setupCourtUsers(applicationContext);

  console.log('== Creating Petitioners');
  await setupPetitioners(applicationContext);

  console.log('== Creating Practitioners');
  await setupPractitioners(applicationContext);

  console.log('== Done!');
})();
