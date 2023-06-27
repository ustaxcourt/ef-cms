import {
  activateAdminAccount,
  createDawsonUser,
  deactivateAdminAccount,
} from './admin';

const { DEFAULT_ACCOUNT_PASS, DEPLOYING_COLOR, EFCMS_DOMAIN } = process.env;

const baseUser = {
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
  employer: '',
  lastName: 'Test',
  password: DEFAULT_ACCOUNT_PASS,
  suffix: '',
};

const createManyAccounts = async ([num, role, section]: [
  number,
  string,
  string,
]) => {
  for (let i = 1; i <= num; i++) {
    const email =
      role === 'chambers'
        ? `${section}${i}@example.com`
        : `${role}${i}@example.com`;

    const user = {
      ...baseUser,
      email,
      name: `Test ${role}${i}`,
      role,
      section,
    };
    await createDawsonUser({
      deployingColorUrl: `https://api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/users`,
      setPermanentPassword: true,
      user,
    });
  }
};

/**
 * Create Court Users
 */
const setupCourtUsers = async () => {
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

  const promises = userSet.map(createManyAccounts);
  await Promise.all(promises);
};

/**
 * Create Petitioners
 */
const setupPetitioners = async () => {
  await createManyAccounts([30, 'petitioner', 'petitioner']);
};

/**
 * Create Practitioners
 */
const setupPractitioners = async () => {
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
        ...baseUser,
        admissionsDate: '2019-03-01',
        admissionsStatus: 'Active',
        barNumber,
        email,
        employer,
        firmName: 'Some Firm',
        firstName: `${role} ${i + 1}`,
        name: `Test ${role}${i + 1}`,
        originalBarState: 'WA',
        password: DEFAULT_ACCOUNT_PASS,
        practitionerType: 'Attorney',
        role,
        section: role,
      };
      return createDawsonUser({
        deployingColorUrl: `https://api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/users`,
        setPermanentPassword: true,
        user,
      });
    });
    await Promise.all(promises);
  }
};

(async () => {
  // check if we have what we need?
  console.log('== Activating Admin Account');
  await activateAdminAccount();
  console.log('== Creating Court Users');
  await setupCourtUsers();
  console.log('== Creating Petitioners');
  await setupPetitioners();
  console.log('== Creating Practitioners');
  await setupPractitioners();
  console.log('== Deactivating Admin Account');
  await deactivateAdminAccount();
  console.log('== Done!');
})();
