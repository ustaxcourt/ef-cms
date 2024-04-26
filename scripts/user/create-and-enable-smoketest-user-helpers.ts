import {
  activateAdminAccount,
  createAdminAccount,
  createDawsonUser,
  deactivateAdminAccount,
  enableUser,
} from '../../shared/admin-tools/user/admin';

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
  lastName: 'Test',
  password: DEFAULT_ACCOUNT_PASS,
  practiceType: '',
  suffix: '',
};

const user = {
  ...baseUser,
  email: 'testAdmissionsClerk@example.com',
  name: 'Test admissionsclerk',
  role: 'admissionsclerk',
  section: 'admissions',
};

export const createAndEnableSmoketestUser = async () => {
  try {
    console.log('About to create admin user!');
    await createAdminAccount();

    console.log('About to activate admin user!');
    await activateAdminAccount();

    console.log('About to create test user!');
    await createDawsonUser({
      deployingColorUrl: `https://api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/users`,
      setPermanentPassword: true,
      user,
    });
    console.log('Successfully created test user!');

    await enableUser(user.email);
    console.log('Successfully enabled test user!');

    console.log('About to deactivate admin user!');
    await deactivateAdminAccount();
  } catch (e) {
    console.log('Unable to create and enable test user. Error was: ', e);
    process.exit(1);
  }
};
