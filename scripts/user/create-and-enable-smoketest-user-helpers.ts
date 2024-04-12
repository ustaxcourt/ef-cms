import { createApplicationContext } from '@web-api/applicationContext';
import {
  createOrUpdateUser,
  enableUser,
} from '../../shared/admin-tools/user/admin';
import { environment } from '@web-api/environment';
import {
  getDestinationTableName,
  getUserPoolId,
} from 'shared/admin-tools/util';

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

export const createAndEnableSmoketestUser = async () => {
  const userPoolId = await getUserPoolId();
  const { tableName } = await getDestinationTableName();
  environment.userPoolId = userPoolId;
  environment.dynamoDbTableName = tableName;
  const applicationContext = createApplicationContext({});

  try {
    console.log('About to create test user!');
    await createOrUpdateUser(applicationContext, {
      password: DEFAULT_ACCOUNT_PASS!,
      user,
    });
    console.log('Successfully created test user!');

    await enableUser(user.email);
    console.log('Successfully enabled test user!');
  } catch (e) {
    console.log('Unable to create and enable test user. Error was: ', e);
    process.exit(1);
  }
};
