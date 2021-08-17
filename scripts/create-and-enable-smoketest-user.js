const {
  createAdminAccount,
  createDawsonUser,
  enableUser,
} = require('../shared/admin-tools/user/admin');
const { DEFAULT_ACCOUNT_PASS } = process.env;

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

const user = {
  ...baseUser,
  email: 'testAdmissionsClerk@example.com',
  name: 'Test admissionsclerk',
  role: 'admissionsclerk',
  section: 'admissions',
};

// this requires an account specific deploy!
(async () => {
  try {
    // do we have to disable this account as well?
    console.log('About to create admin user!');
    await createAdminAccount();
    console.log('About to create test user!');
    await createDawsonUser({ setPermanentPassword: true, user });
    console.log('Successfully created test user!');
    await enableUser(user.email);
    console.log('Successfully enabled test user!');
  } catch (e) {
    console.log('Unable to create and enable test user. Error was: ', e);
    process.exit(1);
  }
})();
