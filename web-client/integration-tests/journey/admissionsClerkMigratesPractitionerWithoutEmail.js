import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { refreshElasticsearchIndex } from '../helpers';
import axios from 'axios';
import faker from 'faker';

const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

faker.seed(faker.datatype.number());

const axiosInstance = axios.create({
  headers: {
    Authorization:
      // mocked admissions clerk user
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlzc2lvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFkbWlzc2lvbnMgQ2xlcmsiLCJyb2xlIjoiYWRtaXNzaW9uc2NsZXJrIiwic2VjdGlvbiI6ImFkbWlzc2lvbnMiLCJ1c2VySWQiOiI5ZDdkNjNiNy1kN2E1LTQ5MDUtYmE4OS1lZjcxYmYzMDA1N2YiLCJjdXN0b206cm9sZSI6ImFkbWlzc2lvbnNjbGVyayIsInN1YiI6IjlkN2Q2M2I3LWQ3YTUtNDkwNS1iYTg5LWVmNzFiZjMwMDU3ZiIsImlhdCI6MTYwOTQ0NTUyNn0.kow3pAUloDseD3isrxgtKBpcKsjMktbRBzY41c1NRqA',
    'Content-Type': 'application/json',
  },
  timeout: 2000,
});

const mockUserId = faker.datatype.uuid();
const mockBarNumber = `ZZ${faker.datatype.number({ max: 9999, min: 1000 })}`;

const practitionerWithoutEmail = {
  user: {
    admissionsDate: '1991-01-11',
    admissionsStatus: 'Active',
    barNumber: mockBarNumber,
    birthYear: 1970,
    contact: {
      address1: 'Suite 111 1st Floor',
      address2: '123 Main Street',
      address3: null,
      city: 'Somewhere',
      countryType: 'domestic',
      phone: '1234567890',
      postalCode: '48839',
      state: 'TN',
    },
    day: '11',
    employer: 'Private',
    entityName: 'Practitioner',
    firstName: 'Test',
    lastName: 'Practitioner',
    middleName: 'V.',
    month: '1',
    name: 'Test V. Practitioner',
    originalBarState: 'TN',
    practitionerType: 'Attorney',
    role: 'privatePractitioner',
    section: 'privatePractitioner',
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    userId: mockUserId,
    year: '1991',
  },
};

export const admissionsClerkMigratesPractitionerWithoutEmail = test => {
  return it('Admissions Clerk migrates practitioner without email', async () => {
    await axiosInstance.post(
      'http://localhost:4000/practitioners',
      practitionerWithoutEmail,
    );

    test.barNumber = practitionerWithoutEmail.user.barNumber;

    await refreshElasticsearchIndex();
  });
};
