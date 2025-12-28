import { RawUser } from '@shared/business/entities/User';
import { createApplicationContext } from '@web-api/applicationContext';
import {
  createOrUpdateUser,
  enableUser,
} from '../../shared/admin-tools/user/admin';
import { getEnvironmentVariables } from '../helpers/parseArgsAndEnvVars';
import { ACCOUNT_STATUS } from '@shared/business/entities/EntityConstants';
import { getUniqueId } from '@shared/sharedAppContext';

const { password } = getEnvironmentVariables({
  password: 'DEFAULT_ACCOUNT_PASS',
});

const user: RawUser = {
  contact: {
    country: 'United States',
    address1: '234 Main St',
    address2: 'Apartment 4',
    address3: 'Under the stairs',
    city: 'Chicago',
    countryType: 'domestic',
    phone: '+1 (555) 555-5555',
    postalCode: '61234',
    state: 'IL',
  },
  email: 'testAdmissionsClerk@example.com',
  name: 'Test admissionsclerk',
  role: 'admissionsclerk',
  section: 'admissions',
  accountStatus: ACCOUNT_STATUS.active,
  userId: getUniqueId(),
};

export const createAndEnableSmoketestUser = async () => {
  const applicationContext = createApplicationContext({});

  try {
    console.log('About to create test user!');
    await createOrUpdateUser(applicationContext, {
      password,
      setPasswordAsPermanent: true,
      user,
    });
    console.log('Successfully created test user!');

    await enableUser(user.email!);
    console.log('Successfully enabled test user!');
  } catch (e) {
    console.log('Unable to create and enable test user. Error was: ', e);
    process.exit(1);
  }
};
